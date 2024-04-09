import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { compareTwoStrings } from "https://deno.land/x/string_similarity/mod.ts";

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
  "et",
  "and",
];

const normalizeString = (value: string) =>
  removeStopWord(
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  ).toLowerCase();

const removeStopWord = (value: string) =>
  value
    .toLowerCase()
    .replace(new RegExp("\\b(" + stopwords.join("|") + ")\\b", "g"), "")
    .replace(/\s/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");

const compareString = (a: string, b: string) =>
  compareTwoStrings(
    normalizeString(a.toLowerCase()),
    normalizeString(b.toString().toLowerCase())
  );

export const DIFFICULTY = {
  moyen: 4,
  difficile: 8,
  impossible: 16,
};

const getDifficultyQuestion = (niveau: number) => {
  const difficulties = ["FACILE", "MOYEN", "DIFFICILE", "IMPOSSIBLE"];
  let result = "FACILE";
  if (niveau >= DIFFICULTY.moyen && niveau < DIFFICULTY.difficile) {
    result = "MOYEN";
  } else if (niveau >= DIFFICULTY.difficile && niveau < DIFFICULTY.impossible) {
    result = "DIFFICILE";
  } else if (niveau >= DIFFICULTY.impossible) {
    result = "IMPOSSIBLE";
  }
  const index = difficulties.findIndex((el) => el === result);
  const difficultiesPossible = difficulties.filter(
    (el, i) => i <= index && i >= index - 1
  );
  return difficultiesPossible;
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
  const idgame = body.game;
  const { data } = await supabase
    .from("sologame")
    .select("*, theme(*)")
    .eq("id", idgame)
    .maybeSingle();
  const id = data.id;
  const theme = data.theme;
  const player = data.player;
  let points = data.points;
  let response = undefined;
  let isAnswer = false;

  const difficulties = getDifficultyQuestion(points);

  const channel = supabase.channel(`${player}${theme.id}`);
  channel
    .on("broadcast", { event: "response" }, async (v) => {
      let result = false;
      const payload = v.payload;
      const value = payload.response.toLowerCase();
      const language = payload.language;

      const LIMIT = 0.7;
      if (response) {
        isAnswer = true;
        if (Array.isArray(response[language])) {
          result = (response[language] as Array<string>).reduce(
            (acc: boolean, b: string) => {
              const val = compareString(b, value) >= LIMIT;
              return acc || val;
            },
            false
          );
        } else {
          result = compareString(response[language] as string, value) >= LIMIT;
        }
        points = result ? points + 1 : points;
        channel.send({
          type: "broadcast",
          event: "validate",
          payload: {
            result: result,
            response: response,
            answer: payload.response,
            points,
          },
        });
        if (result) {
          await supabase
            .from("sologame")
            .update({ points: points })
            .eq("id", id);
          setTimeout(async () => {
            await supabase.functions.invoke("response-solo-game", {
              body: { game: idgame },
            });
          }, 2000);
        } else {
          await supabase.rpc("updatescore", {
            player: player,
            themeid: theme.id,
            newpoints: points,
          });
          await supabase.from("sologame").delete().eq("id", id);
        }
        channel.unsubscribe();
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const { data } = await supabase
          .from("randomquestion")
          .select("*, theme(*)")
          .in("theme", theme.themes)
          .in("difficulty", difficulties)
          .limit(1)
          .maybeSingle();
        response = data.response;
        let responsesQcm: Array<any> = [];
        const qcm =
          data.isqcm === null ? Math.random() < 1 - 0.05 * points : data.isqcm;
        if (qcm) {
          const responses = Array.isArray(data.response["en-US"])
            ? data.allresponse
              ? data.response["en-US"]
              : [data.response["en-US"][0]]
            : [data.response["en-US"]];

          const res = await supabase
            .from("randomresponse")
            .select("*")
            .eq("type", data.typeResponse)
            .not("usvalue", "in", `(${responses.join(",")})`)
            .limit(3);

          const res2 = await supabase
            .from("randomresponse")
            .select("*")
            .eq("type", data.typeResponse)
            .in("usvalue", responses)
            .limit(1);
          responsesQcm = [...res.data, ...res2.data]
            .map((el) => el.value)
            .sort(() => Math.random() - 0.5);
        }
        channel.send({
          type: "broadcast",
          event: "question",
          payload: {
            question: data.question,
            difficulty: data.difficulty,
            image: data.image,
            theme: data.theme,
            isqcm: qcm,
            responses: responsesQcm,
          },
        });
        setTimeout(async () => {
          if (!isAnswer) {
            channel.send({
              type: "broadcast",
              event: "validate",
              payload: {
                result: false,
                answer: "",
                response: response,
                points,
              },
            });
            await supabase.from("sologame").delete().eq("id", id);
            await supabase.rpc("updatescore", {
              player: player,
              themeid: theme.id,
              newpoints: points,
            });
            channel.unsubscribe();
          }
        }, 15000);
      }
    });

  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
