import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";
import { distance } from "https://deno.land/x/fastest_levenshtein/mod.ts";

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
  const idtheme = body.theme;
  const res = await supabase
    .from("theme")
    .select()
    .eq("id", idtheme)
    .maybeSingle();
  const theme = res.data;

  const NUMBERQUESTION = 10;
  const TIMEQUESTION = 15000;
  const TIMERESPONSE = 3000;
  const TIMEFINISHGAME = 30000;
  const TIMEGAME =
    ((TIMEQUESTION + TIMERESPONSE) * NUMBERQUESTION + TIMEFINISHGAME) / 1000;
  const LIMIT = 0.2;

  let response = undefined;
  let time = undefined;
  let gameOn = false;

  const launchGame = async (channel, idtheme) => {
    await supabase.from("publicgameplayer").delete().eq("theme", idtheme);
    const syncPlayers = Object.values(channel.presenceState()).map((el) => ({
      score: el[0].score,
      uuid: el[0].uuid,
      username: el[0].username,
      theme: idtheme,
    }));
    syncPlayers.forEach(async (el) => {
      await supabase.from("publicgameplayer").insert(el);
    });

    const res = await supabase
      .from("randomquestion")
      .select("question, difficulty, response, image")
      .eq("theme", idtheme)
      .limit(NUMBERQUESTION);
    launchQuestion(idtheme, res.data, 0);
  };

  const launchQuestion = (idtheme, questions, index) => {
    const question = questions[index];
    response = question.response;
    time = moment();
    supabase
      .from("publicgame")
      .update({ question: `${index + 1}/${NUMBERQUESTION}` })
      .eq("theme", theme.id)
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
        },
      });
      if (index + 1 < NUMBERQUESTION) {
        setTimeout(() => {
          launchQuestion(idtheme, questions, index + 1);
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
          await supabase.from("publicgameplayer").delete().eq("theme", idtheme);
          await supabase
            .from("publicgame")
            .update({ in_progress: false, question: null })
            .eq("theme", idtheme);
          if (Object.values(channel.presenceState()).length > 0) {
            await supabase.functions.invoke("launch-game", {
              body: { theme: idtheme },
            });
          }
        }, 20000);
      }
    }, TIMEQUESTION);
  };

  const channel = supabase.channel(theme.name["en-US"]);
  channel
    .on("presence", { event: "sync" }, () => {
      supabase
        .from("publicgame")
        .update({ players: Object.values(channel.presenceState()).length })
        .eq("theme", theme.id)
        .then((res) => {
          if (res.error) {
            console.error(res.error);
          }
        });
    })
    .on("presence", { event: "join" }, async ({ newPresences }) => {
      const { data } = await supabase
        .from("publicgameplayer")
        .select()
        .eq("theme", theme.id);
      const uuids = data.map((el) => el.uuid);
      const syncPlayers = newPresences
        .map((el) => ({
          score: el.score,
          uuid: el.uuid,
          username: el.username,
          theme: theme.id,
        }))
        .filter((el) => !uuids.includes(el.uuid));
      syncPlayers.forEach(async (el) => {
        await supabase.from("publicgameplayer").insert(el);
      });
    })
    .on("broadcast", { event: "responseuser" }, async (v) => {
      let result = false;
      const responseuser: {
        uuid: string;
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
      channel.send({
        type: "broadcast",
        event: responseuser.uuid,
        payload: {
          value: value,
          response: result,
          time: time ? moment().diff(moment(time), "milliseconds") : undefined,
        },
      });
      if (result) {
        supabase
          .rpc("addpoint", {
            useruuid: responseuser.uuid,
            themeid: theme.id,
            points: 5,
          })
          .then((res) => {
            const data = res.data;
            if (data && data.id !== null) {
              channel.send({
                type: "broadcast",
                event: "score",
                payload: data,
              });
            }
          });
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        if (!gameOn) {
          const { data } = await supabase
            .from("publicgame")
            .select()
            .eq("theme", theme.id)
            .maybeSingle();
          if (data !== null && !data.in_progress) {
            gameOn = true;
            await supabase
              .from("publicgame")
              .update({
                in_progress: true,
                next_game: moment().add(TIMEGAME, "seconds"),
              })
              .eq("theme", theme.id);
            setTimeout(() => {
              launchGame(channel, theme.id);
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
