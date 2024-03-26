import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { distance } from "https://deno.land/x/fastest_levenshtein/mod.ts";
import moment from "https://esm.sh/moment";

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

  const POINTSCORRECTANSWER = 20;

  const body = await req.json();
  const uuidgame = body.game;
  const { data } = await supabase
    .from("duelgame")
    .select("*")
    .eq("uuid", uuidgame)
    .maybeSingle();
  const game = data;
  const theme = data.theme;
  const player1 = data.player1;
  const player2 = data.player2;
  const questionNumber = data.question;
  let pointsPlayer1 = data.ptsplayer1;
  let pointsPlayer2 = data.ptsplayer2;
  let responsePlayer1 = false;
  let responsePlayer2 = false;

  let response = undefined;
  let time = undefined;

  const channel = supabase.channel(uuidgame);
  channel
    .on("broadcast", { event: "response" }, async (v) => {
      let result = false;
      const timeResponse = moment();
      const delayResponse = timeResponse.diff(time);
      const payload = v.payload;
      const uuid = payload.uuid;
      const value = payload.response.toLowerCase();
      const language = payload.language;

      const LIMIT = 0.2;
      if (
        response &&
        ((uuid === player1 && !responsePlayer1) ||
          (uuid === player2 && !responsePlayer2))
      ) {
        if (Array.isArray(response[language])) {
          result = (response[language] as Array<string>).reduce(
            (acc: boolean, b: string) => {
              const val = compareString(b, value) < LIMIT;
              return acc || val;
            },
            false
          );
        } else {
          result = compareString(response[language] as string, value) < LIMIT;
        }
        if (uuid === player1) {
          responsePlayer1 = true;
          pointsPlayer1 = result
            ? pointsPlayer1 +
              POINTSCORRECTANSWER -
              Math.round(delayResponse / 1000)
            : pointsPlayer1;
        } else {
          responsePlayer2 = true;
          pointsPlayer2 = result
            ? pointsPlayer2 +
              POINTSCORRECTANSWER -
              Math.round(delayResponse / 1000)
            : pointsPlayer2;
        }
        channel.send({
          type: "broadcast",
          event: "validate",
          payload: {
            result: result,
            answer: payload.response,
            uuid,
            time: delayResponse,
          },
        });
        await supabase
          .from("duelgame")
          .update({
            ptsplayer1: pointsPlayer1,
            ptsplayer2: pointsPlayer2,
          })
          .eq("uuid", uuidgame);
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const { data } = await supabase
          .from("randomquestion")
          .select("*, theme(*)")
          .eq("theme", theme)
          .limit(1)
          .maybeSingle();
        response = data.response;
        let responsesQcm: Array<any> = [];
        const qcm = data.isqcm === null ? Math.random() < 0.5 : data.isqcm;
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
        time = moment();
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
          channel.send({
            type: "broadcast",
            event: "endquestion",
            payload: {
              response: response,
            },
          });
          if (questionNumber >= 5) {
            setTimeout(async () => {
              await supabase.from("duelgame").delete().eq("uuid", uuidgame);
            }, 2000);
            channel.unsubscribe();
          } else {
            channel.unsubscribe();
            await supabase
              .from("duelgame")
              .update({ question: questionNumber + 1 })
              .eq("uuid", uuidgame);
            setTimeout(async () => {
              await supabase.functions.invoke("response-duel-game", {
                body: { game: uuidgame },
              });
            }, 2000);
          }
        }, 10000);
      }
    });

  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
