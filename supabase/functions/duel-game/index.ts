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
  supabase: any,
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
  return res;
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

const getNewQuestion = async (
  supabase: any,
  channel: any,
  theme: any,
  questions: any,
  bot: any
) => {
  let question: any = undefined;
  let response = undefined;
  const previousIdQuestion = questions.map((el) => el.id);
  const isGenerate =
    theme.generatequestion !== null
      ? theme.generatequestion
      : Math.random() < 0.5;
  if (isGenerate) {
    question = generateQuestion(Number(theme.id));
    response = question.response;
  } else {
    const { data } = await supabase
      .from("randomquestion")
      .select("*, theme(*)")
      .eq("theme", theme.id)
      .not("id", "in", `(${previousIdQuestion})`)
      .limit(1)
      .maybeSingle();
    question = data;
    let responsesQcm: Array<any> = [];
    question.isqcm = question.isqcm === null ? true : question.isqcm;
    if (question.isqcm) {
      if (question.typequestion === "ORDER") {
        const res = await supabase
          .from("order")
          .select("*")
          .eq("type", question.typeResponse)
          .limit(4);
        responsesQcm = [...res.data]
          .map((el) => ({ label: el.name }))
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
        response = [...responsesQcm].findIndex(
          (el) => el.label === responseOrder.name
        );
      } else if (question.typequestion === "IMAGE") {
        const responses = Array.isArray(question.response["fr-FR"])
          ? question.allresponse
            ? question.response["fr-FR"]
            : [question.response["fr-FR"][0]]
          : [question.response["fr-FR"]];

        const res = await supabase
          .from("randomresponseimage")
          .select("*")
          .eq("type", question.typeResponse)
          .not("usvalue", "in", `(${responses.join(",")})`)
          .limit(3);

        const res2 = await supabase
          .from("randomresponseimage")
          .select("*")
          .eq("type", question.typeResponse)
          .in("usvalue", responses)
          .limit(1);
        responsesQcm = [...res.data, ...res2.data]
          .map((el) => ({ image: el.image }))
          .sort(() => Math.random() - 0.5);
        response = [...responsesQcm].findIndex(
          (el) => el.image === res2.data[0].image
        );
      } else {
        const responses = Array.isArray(question.response["fr-FR"])
          ? question.allresponse
            ? question.response["fr-FR"]
            : [question.response["fr-FR"][0]]
          : [question.response["fr-FR"]];

        const res = await supabase
          .from("randomresponse")
          .select("*")
          .eq("type", question.typeResponse)
          .not("usvalue", "in", `(${responses.join(",")})`)
          .limit(3);

        const res2 = await supabase
          .from("randomresponse")
          .select("*")
          .eq("type", question.typeResponse)
          .in("usvalue", responses)
          .limit(1)
          .maybeSingle();
        responsesQcm = [...res.data, res2.data]
          .map((el) => ({ label: el.value }))
          .sort(() => Math.random() - 0.5);
        response = [...responsesQcm].findIndex(
          (el) => el.label === res2.data.value
        );
      }
      question.responses = [...responsesQcm];
    } else {
      response = question.response;
    }
  }
  const delay = question.isqcm ? 10 : 15;
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
      isqcm: question.isqcm,
      responses: question.responses,
      time: delay,
    },
  });
  if (bot) {
    const isCorrect = Math.random() <= bot.percent;
    if (isCorrect) {
      const delai = randomIntFromInterval(bot.delaiMin, bot.delaiMax);
      const responseBot = question.isqcm
        ? response
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
      const wrongAnswerQCM = [0, 1, 2, 3];
      const responseBot = question.isqcm
        ? randomFromArray([...wrongAnswerQCM].filter((el) => el !== response))
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
  return { delay, response, question };
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomFromArray = (arr: Array<number>) => {
  return arr[Math.floor(Math.random() * arr.length)];
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
    .select(
      "*,theme(*),player1(*,avatar(*),title(*), badge(*)),player2(*,avatar(*),title(*), badge(*))"
    )
    .eq("uuid", uuidgame)
    .maybeSingle();
  const game = data;
  const theme = data.theme;
  const player1 = data.player1.id;
  const player2 = data.player2.id;

  let questions: any = [];

  let pointsPlayer1 = 0;
  let pointsPlayer2 = 0;
  let responsePlayer1 = [false, false, false, false, false];
  let responsePlayer2 = [false, false, false, false, false];
  let answerPlayer1 = undefined;
  let answerPlayer2 = undefined;

  let response: any = undefined;
  let question: any = undefined;
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
      const indexQuestion = questions.length - 1;
      const timeResponse = moment();
      const delayResponse = timeResponse.diff(time);
      const payload = v.payload;
      const uuid = payload.uuid;
      const value = payload.response;
      const language = payload.language;

      if (
        response !== undefined &&
        ((uuid === player1 && !responsePlayer1[indexQuestion]) ||
          (uuid === player2 && !responsePlayer2[indexQuestion]))
      ) {
        if (question.isqcm) {
          result = Number(response) === Number(value);
        } else {
          result = verifyResponse(response[language], value, false);
        }
        const delaypoints =
          POINTSCORRECTANSWER - Math.round(delayResponse / 1000);
        if (uuid === player1) {
          answerPlayer1 = payload.response;
          responsePlayer1[indexQuestion] = true;
          pointsPlayer1 = result ? pointsPlayer1 + delaypoints : pointsPlayer1;
        } else if (uuid === player2) {
          answerPlayer2 = payload.response;
          responsePlayer2[indexQuestion] = true;
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
            ptsplayer1: pointsPlayer1,
            ptsplayer2: pointsPlayer2,
          },
        });
        if (responsePlayer1[indexQuestion] && responsePlayer2[indexQuestion]) {
          channel.send({
            type: "broadcast",
            event: "endquestion",
            payload: {
              response: response,
            },
          });
        }
      }
    })
    .on("broadcast", { event: "endquestion" }, async () => {
      questions = [
        ...questions,
        {
          ...question,
          response: response,
          responsePlayer1: answerPlayer1,
          responsePlayer2: answerPlayer2,
        },
      ];
      if (questions.length >= 5) {
        const isdraw = pointsPlayer1 === pointsPlayer2;
        const result = isdraw ? 0.5 : pointsPlayer1 > pointsPlayer2 ? 1 : 0;
        const elo = await endGame(supabase, player1, player2, theme.id, result);
        setTimeout(async () => {
          channel.send({
            type: "broadcast",
            event: "end",
            payload: {
              elo: elo,
              game: {
                ...game,
                questions,
                ptsplayer1: pointsPlayer1,
                ptsplayer2: pointsPlayer2,
              },
            },
          });
          await supabase.from("duelgame").delete().eq("uuid", uuidgame);

          channel.unsubscribe();
        }, 2000);
      } else {
        setTimeout(async () => {
          const infosQuestion = await getNewQuestion(
            supabase,
            channel,
            theme,
            questions,
            bot
          );
          time = moment();
          answerPlayer1 = undefined;
          answerPlayer2 = undefined;
          delay = infosQuestion.delay;
          response = infosQuestion.response;
          question = infosQuestion.question;
          const index = questions.length - 1;
          setTimeout(async () => {
            if (!(responsePlayer1[index] && responsePlayer2[index])) {
              channel.send({
                type: "broadcast",
                event: "endquestion",
                payload: {
                  response: response,
                },
              });
            }
          }, delay * 1000);
        }, 2000);
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const infosQuestion = await getNewQuestion(
          supabase,
          channel,
          theme,
          questions,
          bot
        );
        time = moment();
        answerPlayer1 = undefined;
        answerPlayer2 = undefined;
        delay = infosQuestion.delay;
        response = infosQuestion.response;
        question = infosQuestion.question;
        const index = questions.length - 1;
        setTimeout(async () => {
          if (!(responsePlayer1[index] && responsePlayer2[index])) {
            channel.send({
              type: "broadcast",
              event: "endquestion",
              payload: {
                response: response,
              },
            });
          }
        }, delay * 1000);
      }
    });

  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
