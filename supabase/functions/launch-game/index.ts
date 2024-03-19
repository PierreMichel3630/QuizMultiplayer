import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";
import { distance } from "https://deno.land/x/fastest_levenshtein/mod.ts";

enum Difficulty {
  FACILE,
  MOYEN,
  DIFFICILE,
  IMPOSSIBLE,
}

const stopwords = [
  "the",
  "of",
  "le",
  "la",
  "l'",
  "de",
  "des",
  "un",
  "une",
  "ce",
  "se",
  ":",
  "et",
  "and",
  "/",
  ",",
  ";",
];

const normalizeString = (value: string) =>
  removeSpecialCharacter(
    removeStopWord(value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

const removeStopWord = (value: string) =>
  value.replace(new RegExp("\\b(" + stopwords.join("|") + ")\\b", "g"), "");

const removeSpecialCharacter = (value: string) => value.replace(/\.|\&/g, "");

const compareString = (a: string, b: string) =>
  distance(
    normalizeString(a.toLowerCase()),
    normalizeString(b.toString().toLowerCase())
  ) / a.length;

const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (v, k) => k + start);

const getDifficulty = (min: string, max: string) => {
  const values = Object.values(Difficulty);
  const indexmin = values.indexOf(min as unknown as Difficulty);
  const indexmax = values.indexOf(max as unknown as Difficulty);
  const result: Array<string> = range(indexmin, indexmax + 1).map(
    (el) => Difficulty[el]
  );
  return result;
};

const getRandomTheme = (
  themes: Array<{ id: number; difficultymax: string; difficultymin: string }>,
  numberRandom: number
) => {
  const array: Array<{ theme: number; difficulties: Array<string> }> = Array(
    numberRandom
  )
    .fill(undefined)
    .map(() => {
      const theme = themes[Math.floor(themes.length * Math.random())];
      const difficulties = getDifficulty(
        theme.difficultymin,
        theme.difficultymax
      );
      return { theme: theme.id, difficulties };
    });
  return array;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const body = await req.json();
  const id = body.game;
  const res = await supabase.from("game").select().eq("id", id).maybeSingle();
  const game = res.data;

  const NUMBERQUESTION = 10;
  const TIMEQUESTION = 15000;
  const TIMERESPONSE = 3000;
  const TIMEFINISHGAME = 30000;
  const TIMEGAME =
    ((TIMEQUESTION + TIMERESPONSE) * NUMBERQUESTION + TIMEFINISHGAME) / 1000;
  const LIMIT = 0.2;
  const POINTSANSWER = 5;
  const POINTSFIRST = 3;
  const POINTSSECOND = 2;
  const POINTSTHIRD = 1;
  const HEALTH = 3;

  let response = undefined;
  let time = undefined;
  let gameOn = false;
  let responsePlayer: Array<{ uuid: string; username: string; time: any }> = [];
  let healths: Array<{ uuid: string; value: number }> = [];

  const launchGame = async (channel) => {
    await supabase.from("gameplayer").delete().eq("game", id);
    const syncPlayers = Object.values(channel.presenceState()).map((el) => ({
      score: el[0].score,
      uuid: el[0].uuid,
      username: el[0].username,
      game: id,
    }));
    syncPlayers.forEach(async (el) => {
      await supabase.from("gameplayer").insert(el);
    });

    const themes = getRandomTheme(game.themes, NUMBERQUESTION);
    const promises = themes.map((el) => {
      return supabase
        .from("randomquestion")
        .select("question, difficulty, response, image, theme(*)")
        .eq("theme", el.theme)
        .in("difficulty", el.difficulties)
        .limit(1)
        .maybeSingle();
    });
    Promise.all(promises).then((res) => {
      const questions = res.map((el) => el.data);
      launchQuestion(questions, 0);
    });
  };

  const launchQuestion = (questions, index) => {
    const question = questions[index];
    response = question.response;
    time = moment();
    supabase
      .from("game")
      .update({ question: `${index + 1}/${NUMBERQUESTION}` })
      .eq("id", id)
      .then((res) => {
        if (res.error) {
          console.error(res.error);
        }
      });
    channel.send({
      type: "broadcast",
      event: "question",
      payload: {
        order: index + 1,
        question: question.question,
        difficulty: question.difficulty,
        image: question.image,
        date: time,
      },
    });
    setTimeout(() => {
      const timeResponse = moment();
      response = undefined;
      channel.send({
        type: "broadcast",
        event: "response",
        payload: {
          response: question.response,
          date: timeResponse,
          players: responsePlayer,
        },
      });
      responsePlayer = [];
      healths = [];
      if (index + 1 < NUMBERQUESTION) {
        setTimeout(() => {
          launchQuestion(questions, index + 1);
        }, TIMERESPONSE);
      } else {
        response = undefined;
        setTimeout(() => {
          channel.send({
            type: "broadcast",
            event: "end",
            payload: {
              questions: questions,
            },
          });
          channel.unsubscribe();
        }, TIMERESPONSE);
        setTimeout(async () => {
          await supabase.from("gameplayer").delete().eq("game", id);
          await supabase
            .from("game")
            .update({ in_progress: false, question: null })
            .eq("id", id);
          if (
            Object.values(channel.presenceState()).length > 0 &&
            game.type === "PUBLIC"
          ) {
            await supabase.functions.invoke("launch-game", {
              body: { game: id },
            });
          }
        }, 20000);
      }
    }, TIMEQUESTION);
  };

  const channel = supabase.channel(game.channel);
  channel
    .on("presence", { event: "sync" }, () => {
      supabase
        .from("game")
        .update({ players: Object.values(channel.presenceState()).length })
        .eq("id", id)
        .then((res) => {
          if (res.error) {
            console.error(res.error);
          }
        });
    })
    .on("presence", { event: "join" }, async ({ newPresences }) => {
      const { data } = await supabase
        .from("gameplayer")
        .select()
        .eq("game", id);
      const uuids = data.map((el) => el.uuid);
      const syncPlayers = newPresences
        .map((el) => ({
          score: el.score,
          uuid: el.uuid,
          username: el.username,
          game: id,
        }))
        .filter((el) => !uuids.includes(el.uuid));
      syncPlayers.forEach(async (el) => {
        await supabase.from("gameplayer").insert(el);
      });
    })
    .on("broadcast", { event: "responseuser" }, async (v) => {
      let result = false;
      const responseuser: {
        uuid: string;
        username: string;
        value: string;
        language: string;
      } = v.payload;
      const value: string = responseuser.value.toLowerCase();
      if (response) {
        if (Array.isArray(response[responseuser.language])) {
          result = (response[responseuser.language] as Array<string>).reduce(
            (acc: boolean, b: string) => {
              const val = compareString(b, value) < LIMIT;
              return acc || val;
            },
            false
          );
        } else {
          result =
            compareString(response[responseuser.language] as string, value) <
            LIMIT;
        }
      }
      const timeresponse = time
        ? moment().diff(moment(time), "milliseconds")
        : undefined;
      // Gestion vie des joueurs
      let healthPlayer = healths.find((el) => el.uuid === responseuser.uuid);
      if (healthPlayer) {
        healthPlayer = {
          uuid: healthPlayer.uuid,
          value: result ? healthPlayer.value : healthPlayer.value - 1,
        };
        healths = [
          ...healths.filter((el) => el.uuid !== responseuser.uuid),
          healthPlayer,
        ];
      } else {
        healthPlayer = {
          uuid: responseuser.uuid,
          value: result ? HEALTH : HEALTH - 1,
        };
        healths = [...healths, healthPlayer];
      }
      // Gestion si reponse correcte
      if (result && healthPlayer.value >= 0) {
        responsePlayer = [
          ...responsePlayer,
          {
            uuid: responseuser.uuid,
            username: responseuser.username,
            time: timeresponse,
          },
        ];
        let pointsFastest = 0;
        let position: undefined | number = undefined;
        if (responsePlayer.length === 1) {
          pointsFastest = POINTSFIRST;
          position = 1;
        } else if (responsePlayer.length === 2) {
          pointsFastest = POINTSSECOND;
          position = 2;
        } else if (responsePlayer.length === 3) {
          pointsFastest = POINTSTHIRD;
          position = 3;
        }

        channel.send({
          type: "broadcast",
          event: responseuser.uuid,
          payload: {
            value: value,
            response: result,
            time: timeresponse,
            position: position,
            health: healthPlayer.value,
          },
        });
        supabase
          .rpc("addpoint", {
            useruuid: responseuser.uuid,
            gameid: id,
            points: POINTSANSWER + pointsFastest,
          })
          .then((res) => {
            const data = res.data;
            if (data && data.id !== null) {
              channel.send({
                type: "broadcast",
                event: "score",
                payload: { ...data, position: position },
              });
            }
          });
      } else if (healthPlayer.value >= 0) {
        channel.send({
          type: "broadcast",
          event: responseuser.uuid,
          payload: {
            value: value,
            response: result,
            time: timeresponse,
            health: healthPlayer.value,
          },
        });
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        if (!gameOn) {
          const { data } = await supabase
            .from("game")
            .select()
            .eq("id", id)
            .maybeSingle();
          if (data !== null && !data.in_progress) {
            gameOn = true;
            await supabase
              .from("game")
              .update({
                in_progress: true,
                next_game: moment().add(TIMEGAME, "seconds"),
              })
              .eq("id", id);
            setTimeout(() => {
              launchGame(channel);
            }, 10000);
          }
        } else {
          channel.unsubscribe();
        }
      }
    });
  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
