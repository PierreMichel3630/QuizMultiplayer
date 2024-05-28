import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";
import { generateQuestion } from "../_shared/generateQuestion.ts";
import { verifyResponse } from "../_shared/response.ts";

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
    victoryprop: result === 1 ? 1 : 0,
    drawprop: result === 0.5 ? 1 : 0,
    defeatprop: result === 0 ? 1 : 0,
  });
  await supabase.rpc("addgameduel", {
    player: player2,
    themeid: theme,
    victoryprop: result === 0 ? 1 : 0,
    drawprop: result === 0.5 ? 1 : 0,
    defeatprop: result === 1 ? 1 : 0,
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
      delaiMin: 1,
      delaiMax: 3,
      language: "fr-FR",
    },
    {
      uuid: "006c5385-8e71-41f7-801f-b6ee56f9996c",
      percent: 0.85,
      delaiMin: 3,
      delaiMax: 5,
      language: "fr-FR",
    },
    {
      uuid: "931b2102-9550-4c8e-a629-fcd858293b18",
      percent: 0.5,
      delaiMin: 5,
      delaiMax: 7,
      language: "fr-FR",
    },
    {
      uuid: "eed610db-4b85-4e0e-aa11-7497d5159393",
      percent: 0.3,
      delaiMin: 7,
      delaiMax: 10,
      language: "fr-FR",
    },
    {
      uuid: "9e5543c3-ec9d-4a9c-8f0c-6e634759eb45",
      percent: 0.1,
      delaiMin: 1,
      delaiMax: 10,
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
  let wrongresponseQCM = [];
  let time = undefined;
  let delay = 15;

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
        const delaypoints =
          POINTSCORRECTANSWER - Math.round(delayResponse / 1000);
        if (uuid === player1) {
          responsePlayer1 = true;
          pointsPlayer1 = result ? pointsPlayer1 + delaypoints : pointsPlayer1;
        } else if (uuid === player2) {
          responsePlayer2 = true;
          pointsPlayer2 = result ? pointsPlayer2 + delaypoints : pointsPlayer2;
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
              questions: [...questions, { ...question, response: response }],
            })
            .eq("uuid", uuidgame);
          if (questionNumber >= 5) {
            const isdraw = pointsPlayer1 === pointsPlayer2;
            const result = isdraw ? 0.5 : pointsPlayer1 > pointsPlayer2 ? 1 : 0;
            endGame(
              channel,
              supabase,
              uuidgame,
              player1,
              player2,
              theme.id,
              result
            );
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
        const isGenerate =
          theme.generatequestion !== null
            ? theme.generatequestion
            : Math.random() < 0.5;
        if (isGenerate) {
          question = generateQuestion(Number(theme.id));
        } else {
          const { data } = await supabase
            .from("randomquestion")
            .select("*, theme(*)")
            .eq("theme", theme.id)
            .not("id", "in", `(${previousIdQuestion})`)
            .limit(1)
            .maybeSingle();
          question = data;
        }
        response = question.response;

        let responsesQcm: Array<any> = [];
        const qcm = question.isqcm === null ? true : question.isqcm;
        if (qcm) {
          if (question.order) {
            const res = await supabase
              .from("order")
              .select("*")
              .eq("type", question.typeResponse)
              .limit(4);
            responsesQcm = [...res.data]
              .map((el) => el.name)
              .sort(() => Math.random() - 0.5);
            const responseOrder =
              question.order === "ASC"
                ? [...res.data].sort((a, b) =>
                    a.format === "DATE"
                      ? moment(a.value, "DD/MM/YYYY").diff(
                          moment(b.value, "DD/MM/YYYY")
                        )
                      : a.value - b.value
                  )[0]
                : [...res.data].sort((a, b) =>
                    a.format === "DATE"
                      ? moment(b.value, "DD/MM/YYYY").diff(
                          moment(a.value, "DD/MM/YYYY")
                        )
                      : b.value - a.value
                  )[0];
            correctresponseQCM = responseOrder.name;
            response = responseOrder.name;
          } else {
            const responses = Array.isArray(question.response["en-US"])
              ? question.allresponse
                ? question.response["en-US"]
                : [question.response["en-US"][0]]
              : [question.response["en-US"]];

            const res = await supabase
              .from("randomresponse")
              .select("*")
              .eq("type", question.typeResponse)
              .not("usvalue", "in", `(${responses.join(",")})`)
              .limit(3);
            wrongresponseQCM = [
              ...res.data.map((el) => el.value).sort(() => Math.random() - 0.5),
            ];

            const res2 = await supabase
              .from("randomresponse")
              .select("*")
              .eq("type", question.typeResponse)
              .in("usvalue", responses)
              .limit(1)
              .maybeSingle();
            correctresponseQCM = res2.data.value;
            responsesQcm = [...res.data, res2.data]
              .map((el) => el.value)
              .sort(() => Math.random() - 0.5);
          }
        }
        time = moment();
        delay = qcm ? 15 : 15;
        channel.send({
          type: "broadcast",
          event: "question",
          payload: {
            question: question.question,
            difficulty: question.difficulty,
            image: question.image,
            audio: question.audio,
            extra: question.extra,
            theme: question.theme,
            isqcm: qcm,
            responses: responsesQcm,
            time: delay,
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
          } else {
            const delai = randomIntFromInterval(2, 8);
            const responseBot = qcm
              ? wrongresponseQCM[0][bot.language]
              : "dontknow";
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
                questions: [...questions, { ...question, response: response }],
              })
              .eq("uuid", uuidgame);
            if (questionNumber >= 5) {
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
            } else {
              channel.unsubscribe();
              setTimeout(async () => {
                await supabase.functions.invoke("response-duel-game", {
                  body: { game: uuidgame },
                });
              }, 2000);
            }
          }
        }, delay * 1000);
      }
    });

  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
