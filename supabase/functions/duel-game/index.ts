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
  uuidgame: any,
  player1: string,
  player2: string,
  pointsPlayer1: number,
  pointsPlayer2: number,
  theme: number,
  result: number
) => {
  const res = await calculelo(supabase, player1, player2, theme, result);
  const xpplayer1 = {
    match: 50,
    matchscore: pointsPlayer1,
    victorybonus: result === 1 ? 50 : 0,
  };
  const totalxp1 =
    xpplayer1.match + xpplayer1.matchscore + xpplayer1.victorybonus;
  const xpplayer2 = {
    match: 50,
    matchscore: pointsPlayer2,
    victorybonus: result === 0 ? 50 : 0,
  };
  const totalxp2 =
    xpplayer2.match + xpplayer2.matchscore + xpplayer2.victorybonus;
  await supabase.rpc("addgameduel", {
    player: player1,
    themeid: theme,
    victoryprop: result === 1 ? 1 : 0,
    drawprop: result === 0.5 ? 1 : 0,
    defeatprop: result === 0 ? 1 : 0,
    elo: res.delta,
    xpprop: totalxp1,
  });
  await supabase.rpc("addgameduel", {
    player: player2,
    themeid: theme,
    victoryprop: result === 0 ? 1 : 0,
    drawprop: result === 0.5 ? 1 : 0,
    defeatprop: result === 1 ? 1 : 0,
    elo: -res.delta,
    xpprop: totalxp2,
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
  await supabase
    .from("duelgame")
    .update({ status: "END" })
    .eq("uuid", uuidgame);
  return { ...res, xpplayer1, xpplayer2 };
};

const calculelo = async (
  supabase: any,
  player1: string,
  player2: string,
  theme: number,
  result: number
) => {
  const { data } = await supabase
    .from("score")
    .select()
    .or(`profile.eq.${player1},profile.eq.${player2}`)
    .eq("theme", theme);
  const scorePlayer1 = data
    ? data.find((el) => el.profile === player1)
    : undefined;
  const scorePlayer2 = data
    ? data.find((el) => el.profile === player2)
    : undefined;
  const eloPlayer1 = scorePlayer1 ? scorePlayer1.rank : 1000;
  const eloPlayer2 = scorePlayer2 ? scorePlayer2.rank : 1000;
  const myChanceToWin = 1 / (1 + Math.pow(10, (eloPlayer2 - eloPlayer1) / 400));
  const delta = Math.round(32 * (result - myChanceToWin));
  return {
    eloPlayer1: eloPlayer1 + delta,
    eloPlayer2: eloPlayer2 - delta,
    delta: delta,
  };
};

const getNewQuestion = async (
  supabase: any,
  channel: any,
  themeDefined: any,
  questions: any,
  bot: any
) => {
  let theme = themeDefined;
  if (themeDefined.id === 271) {
    const { data } = await supabase
      .from("randomtheme")
      .select("*")
      .is("enabled", true)
      .not("id", "in", `(271,272)`)
      .limit(1)
      .maybeSingle();
    theme = data;
  }
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
    const res = await supabase
      .from("randomquestion")
      .select("*, theme(*)")
      .eq("theme", theme.id)
      .not("id", "in", `(${previousIdQuestion})`)
      .limit(1)
      .maybeSingle();
    console.log(res);
    question = res.data;
    let responsesQcm: Array<any> = [];
    question.isqcm = question.isqcm === null ? true : question.isqcm;
    if (question.isqcm) {
      if (question.typequestion === "ORDER") {
        const res = await supabase
          .from("order")
          .select("*")
          .eq("type", question.typeResponse)
          .limit(4);
        console.log(res);
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
      } else if (question.typequestion === "QCM") {
        responsesQcm = [...question.responses, question.response]
          .map((el) => ({ label: el }))
          .sort(() => Math.random() - 0.5);

        response = [...responsesQcm].findIndex(
          (el) => el.label === question.response
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
      type: question.typequestion,
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
      delaiMax: 1.5,
      language: "fr-FR",
    },
    {
      uuid: "204f3ba7-231d-43d1-bef8-a533edf0472c",
      percent: 0.95,
      delaiMin: 1,
      delaiMax: 3,
      language: "fr-FR",
    },
    {
      uuid: "68571fa7-1620-47d6-81d1-00e5b5a7ff60",
      percent: 0.9,
      delaiMin: 1,
      delaiMax: 4,
      language: "fr-FR",
    },
    {
      uuid: "006c5385-8e71-41f7-801f-b6ee56f9996c",
      percent: 0.85,
      delaiMin: 2,
      delaiMax: 6,
      language: "fr-FR",
    },
    {
      uuid: "34fc3125-b246-4cd5-807c-e01b3500d0fc",
      percent: 0.8,
      delaiMin: 3,
      delaiMax: 5,
      language: "fr-FR",
    },
    {
      uuid: "464bdedb-d850-49b9-bace-54787165306c",
      percent: 0.75,
      delaiMin: 3,
      delaiMax: 6,
      language: "fr-FR",
    },
    {
      uuid: "90cb6f61-c008-4989-974c-c2943758c323",
      percent: 0.7,
      delaiMin: 3,
      delaiMax: 6,
      language: "fr-FR",
    },
    {
      uuid: "931b2102-9550-4c8e-a629-fcd858293b18",
      percent: 0.65,
      delaiMin: 2,
      delaiMax: 7,
      language: "fr-FR",
    },
    {
      uuid: "8ee8c149-ab03-49ef-9605-c53471b6c139",
      percent: 0.6,
      delaiMin: 2,
      delaiMax: 8,
      language: "fr-FR",
    },
    {
      uuid: "3e449f41-ae9d-4bb3-89da-d85708bb4957",
      percent: 0.5,
      delaiMin: 3,
      delaiMax: 7,
      language: "fr-FR",
    },
    {
      uuid: "cc373b55-e48d-4099-9e69-31dfdadcb2e0",
      percent: 0.5,
      delaiMin: 4,
      delaiMax: 8,
      language: "fr-FR",
    },
    {
      uuid: "4da66ce4-e3ef-4201-b26d-07e71407cd6d",
      percent: 0.4,
      delaiMin: 5,
      delaiMax: 8,
      language: "fr-FR",
    },
    {
      uuid: "eed610db-4b85-4e0e-aa11-7497d5159393",
      percent: 0.3,
      delaiMin: 5,
      delaiMax: 8,
      language: "fr-FR",
    },
    {
      uuid: "e6391030-89c4-4966-84be-a05f859860eb",
      percent: 0.2,
      delaiMin: 1,
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
      "*,battlegame!duelgame_battlegame_fkey(*), theme!public_duelgame_theme_fkey(*),themequestion(*),player1(*,avatar(*),title(*), badge(*)),player2(*,avatar(*),title(*), badge(*))"
    )
    .eq("uuid", uuidgame)
    .maybeSingle();
  const game = data;
  const battlegame = game.battlegame;
  const theme = game.theme;
  const themequestion = game.themequestion;
  const player1 = game.player1.id;
  const player2 = game.player2.id;

  let questions: any = [];

  let pointsPlayer1 = 0;
  let pointsPlayer2 = 0;
  let responsePlayer1 = [false, false, false, false, false];
  let responsePlayer2 = [false, false, false, false, false];
  let answerPlayer1 = undefined;
  let answerPlayer2 = undefined;
  let resultPlayer1 = false;
  let resultPlayer2 = false;

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
      console.log(payload);

      if (
        response !== undefined &&
        ((uuid === player1 && !responsePlayer1[indexQuestion]) ||
          (uuid === player2 && !responsePlayer2[indexQuestion]))
      ) {
        if (question.isqcm) {
          result = Number(response) === Number(value);
        } else {
          result = verifyResponse(response[language], value, question.exact);
        }
        const delaypoints =
          POINTSCORRECTANSWER - Math.round(delayResponse / 1000);
        if (uuid === player1) {
          resultPlayer1 = result;
          answerPlayer1 = payload.response;
          responsePlayer1[indexQuestion] = true;
          pointsPlayer1 = result ? pointsPlayer1 + delaypoints : pointsPlayer1;
        } else if (uuid === player2) {
          resultPlayer2 = result;
          answerPlayer2 = payload.response;
          responsePlayer2[indexQuestion] = true;
          pointsPlayer2 = result ? pointsPlayer2 + delaypoints : pointsPlayer2;
        }
        console.log({
          result: result,
          answer: payload.response,
          uuid,
          time: delayResponse,
          ptsplayer1: pointsPlayer1,
          ptsplayer2: pointsPlayer2,
        });
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
          console.log("endquestion :", response);
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
          resultPlayer1,
          resultPlayer2,
        },
      ];
      if (questions.length >= 5) {
        const isdraw = pointsPlayer1 === pointsPlayer2;
        const result = isdraw ? 0.5 : pointsPlayer1 > pointsPlayer2 ? 1 : 0;
        const elo = await endGame(
          supabase,
          uuidgame,
          player1,
          player2,
          pointsPlayer1,
          pointsPlayer2,
          theme.id,
          result
        );
        if (battlegame !== null) {
          const games = [
            ...battlegame.games,
            { theme: theme, pointsPlayer1, pointsPlayer2 },
          ];
          await supabase
            .from("battlegame")
            .update({
              scoreplayer1:
                result === 1
                  ? battlegame.scoreplayer1 + 1
                  : battlegame.scoreplayer1,
              scoreplayer2:
                result === 0
                  ? battlegame.scoreplayer2 + 1
                  : battlegame.scoreplayer2,
              readyplayer1: false,
              readyplayer2: false,
              game: null,
              games: games,
            })
            .eq("uuid", battlegame.uuid);
        }
        await supabase
          .from("duelgame")
          .update({
            ptsplayer1: pointsPlayer1,
            ptsplayer2: pointsPlayer2,
            questions,
          })
          .eq("uuid", uuidgame);
        channel.send({
          type: "broadcast",
          event: "end",
          payload: {
            extra: elo,
            game: {
              ...game,
              questions,
              ptsplayer1: pointsPlayer1,
              ptsplayer2: pointsPlayer2,
            },
          },
        });
      } else {
        setTimeout(async () => {
          const infosQuestion = await getNewQuestion(
            supabase,
            channel,
            themequestion,
            questions,
            bot
          );
          console.log(infosQuestion);
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
          themequestion,
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
