import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";
import { compareTwoStrings } from "https://deno.land/x/string_similarity/mod.ts";
import { getRandomElement } from "../_shared/random.ts";
import { verifyResponse } from "../_shared/response.ts";
import {
  GENERATETHEME,
  generateQuestion,
} from "../_shared/generateQuestion.ts";

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const endGame = async (
  channel: any,
  supabase: any,
  uuidgame: string,
  player1: string,
  player2: string,
  theme: number,
  result: number
) => {
  await supabase.rpc("addgameduel", {
    player: player1,
    themeid: theme,
    victory: result === 1 ? 1 : 0,
    draw: result === 0.5 ? 1 : 0,
    defeat: result === 0 ? 1 : 0,
  });
  await supabase.rpc("addgameduel", {
    player: player2,
    themeid: theme,
    victory: result === 0 ? 1 : 0,
    draw: result === 0.5 ? 1 : 0,
    defeat: result === 1 ? 1 : 0,
  });
  await supabase.rpc("addopposition", {
    player1uuid: player1,
    player2uuid: player2,
    themeid: theme,
    victory: result === 1 ? 1 : 0,
    draw: result === 0.5 ? 1 : 0,
    defeat: result === 0 ? 1 : 0,
  });
  await supabase.rpc("addopposition", {
    player1uuid: player2,
    player2uuid: player1,
    themeid: theme,
    victory: result === 0 ? 1 : 0,
    draw: result === 0.5 ? 1 : 0,
    defeat: result === 1 ? 1 : 0,
  });
  const res = await calculelo(supabase, player1, player2, theme, result);
  channel.send({
    type: "broadcast",
    event: "rank",
    payload: res,
  });
  channel.unsubscribe();
  setTimeout(async () => {
    await supabase.from("duelgame").delete().eq("uuid", uuidgame);
  }, 2000);
};

const calculelo = async (
  supabase: any,
  player1: string,
  player2: string,
  theme: number,
  result: number
) => {
  const { data } = await supabase
    .from("rank")
    .select()
    .or(`profile.eq.${player1},profile.eq.${player2}`)
    .eq("theme", theme);
  const rankPlayer1 = data
    ? data.find((el) => el.profile === player1)
    : undefined;
  const rankPlayer2 = data
    ? data.find((el) => el.profile === player2)
    : undefined;
  const eloPlayer1 = rankPlayer1 ? rankPlayer1.points : 1000;
  const eloPlayer2 = rankPlayer2 ? rankPlayer2.points : 1000;
  const myChanceToWin = 1 / (1 + Math.pow(10, (eloPlayer2 - eloPlayer1) / 400));
  const delta = Math.round(32 * (result - myChanceToWin));
  await supabase.rpc("updateranking", {
    playeruuid: player1,
    themeid: theme,
    pts: delta,
  });
  await supabase.rpc("updateranking", {
    playeruuid: player2,
    themeid: theme,
    pts: -delta,
  });
  return {
    eloPlayer1: eloPlayer1 + delta,
    eloPlayer2: eloPlayer2 - delta,
    delta: delta,
  };
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
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

  const BOTS = [
    {
      uuid: "571b2a1c-e2ca-4e95-9d99-80a17b5796a4",
      percent: 1,
      delaiMin: 2,
      delaiMax: 5,
      language: "fr-FR",
    },
    {
      uuid: "006c5385-8e71-41f7-801f-b6ee56f9996c",
      percent: 0.85,
      delaiMin: 3,
      delaiMax: 10,
      language: "fr-FR",
    },
    {
      uuid: "931b2102-9550-4c8e-a629-fcd858293b18",
      percent: 0.5,
      delaiMin: 8,
      delaiMax: 15,
      language: "fr-FR",
    },
    {
      uuid: "eed610db-4b85-4e0e-aa11-7497d5159393",
      percent: 0.3,
      delaiMin: 10,
      delaiMax: 15,
      language: "fr-FR",
    },
    {
      uuid: "9e5543c3-ec9d-4a9c-8f0c-6e634759eb45",
      percent: 0.1,
      delaiMin: 10,
      delaiMax: 18,
      language: "fr-FR",
    },
  ];

  const POINTSCORRECTANSWER = 25;

  const body = await req.json();
  const uuidgame = body.game;
  const { data } = await supabase
    .from("duelgame")
    .select("*,theme(*)")
    .eq("uuid", uuidgame)
    .maybeSingle();
  const game = data;
  const theme = data.theme;
  const player1 = data.player1;
  const player2 = data.player2;
  const questionNumber = data.question;
  const questions = data.questions;
  const previousIdQuestion = questions.map((el) => el.id).join(",");
  let pointsPlayer1 = data.ptsplayer1;
  let pointsPlayer2 = data.ptsplayer2;
  let responsePlayer1 = false;
  let responsePlayer2 = false;

  let response = undefined;
  let question: any = undefined;
  let correctresponseQCM = undefined;
  let time = undefined;
  const randomTheme = getRandomElement(theme.themes);

  const bot = BOTS.find((el) => el.uuid === player2);
  const channel = supabase.channel(uuidgame, {
    config: {
      broadcast: { self: true },
    },
  });
  channel
    .on("broadcast", { event: "response" }, async (v) => {
      let result = false;
      const timeResponse = moment();
      const delayResponse = timeResponse.diff(time);
      const payload = v.payload;
      const uuid = payload.uuid;
      const value = payload.response.toString().toLowerCase();
      const language = payload.language;

      if (
        response &&
        ((uuid === player1 && !responsePlayer1) ||
          (uuid === player2 && !responsePlayer2))
      ) {
        result = verifyResponse(response[language], value);
        if (uuid === player1) {
          responsePlayer1 = true;
          pointsPlayer1 = result
            ? pointsPlayer1 +
              POINTSCORRECTANSWER -
              Math.round(delayResponse / 1000)
            : pointsPlayer1;
        } else if (uuid === player2) {
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

        if (responsePlayer1 && responsePlayer2) {
          channel.send({
            type: "broadcast",
            event: "endquestion",
            payload: {
              response: response,
            },
          });
          await supabase
            .from("duelgame")
            .update({
              question: questionNumber + 1,
              questions: [...questions, question],
            })
            .eq("uuid", uuidgame);
          if (questionNumber >= 5) {
            setTimeout(async () => {
              const isdraw = pointsPlayer1 === pointsPlayer2;
              const result = isdraw
                ? 0.5
                : pointsPlayer1 > pointsPlayer2
                ? 1
                : 0;
              endGame(
                channel,
                supabase,
                uuidgame,
                player1,
                player2,
                theme.id,
                result
              );
            }, 2000);
          } else {
            channel.unsubscribe();
            setTimeout(async () => {
              await supabase.functions.invoke("response-duel-game", {
                body: { game: uuidgame },
              });
            }, 2000);
          }
        }
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        if (GENERATETHEME.includes(Number(randomTheme))) {
          question = generateQuestion(Number(randomTheme));
        } else {
          const { data } = await supabase
            .from("randomquestion")
            .select("*, theme(*)")
            .in("theme", theme.themes)
            .not("id", "in", `(${previousIdQuestion})`)
            .limit(1)
            .maybeSingle();
          question = data;
        }
        response = question.response;

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
            .limit(1)
            .maybeSingle();
          correctresponseQCM = res2.data.value;
          responsesQcm = [...res.data, res2.data]
            .map((el) => el.value)
            .sort(() => Math.random() - 0.5);
        }
        time = moment();
        channel.send({
          type: "broadcast",
          event: "question",
          payload: {
            question: question.question,
            difficulty: question.difficulty,
            image: question.image,
            theme: question.theme,
            isqcm: qcm,
            responses: responsesQcm,
          },
        });
        if (bot) {
          const isCorrect = Math.random() <= bot.percent;
          if (isCorrect) {
            const delai = randomIntFromInterval(bot.delaiMin, bot.delaiMax);
            const responseBot = qcm
              ? correctresponseQCM
                ? correctresponseQCM[bot.language]
                : ""
              : response
              ? Array.isArray(response[bot.language])
                ? response[bot.language][0]
                : response[bot.language]
              : "";
            setTimeout(() => {
              channel.send({
                type: "broadcast",
                event: "response",
                payload: {
                  response: responseBot,
                  language: bot.language,
                  uuid: bot.uuid,
                },
              });
            }, delai * 1000);
          }
        }
        setTimeout(async () => {
          if (!(responsePlayer1 && responsePlayer2)) {
            channel.send({
              type: "broadcast",
              event: "endquestion",
              payload: {
                response: response,
              },
            });
            await supabase
              .from("duelgame")
              .update({
                question: questionNumber + 1,
                questions: [...questions, question],
              })
              .eq("uuid", uuidgame);
            if (questionNumber >= 5) {
              setTimeout(async () => {
                const isdraw = pointsPlayer1 === pointsPlayer2;
                const result = isdraw
                  ? 0.5
                  : pointsPlayer1 > pointsPlayer2
                  ? 1
                  : 0;
                endGame(
                  channel,
                  supabase,
                  uuidgame,
                  player1,
                  player2,
                  theme.id,
                  result
                );
              }, 2000);
            } else {
              channel.unsubscribe();
              setTimeout(async () => {
                await supabase.functions.invoke("response-duel-game", {
                  body: { game: uuidgame },
                });
              }, 2000);
            }
          }
        }, 15000);
      }
    });

  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
