import { createClient } from "supabase";
import moment from "moment";

import { generateQuestion } from "../_shared/generateQuestion.ts";
import { DIFFICULTIES } from "../_shared/random.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export const DIFFICULTY = {
  moyen: 4,
  difficile: 8,
  impossible: 16,
};

const getDifficultyQuestion = (niveau: number) => {
  let result = "FACILE";
  if (niveau >= DIFFICULTY.moyen && niveau < DIFFICULTY.difficile) {
    result = "MOYEN";
  } else if (niveau >= DIFFICULTY.difficile && niveau < DIFFICULTY.impossible) {
    result = "DIFFICILE";
  } else if (niveau >= DIFFICULTY.impossible) {
    result = "IMPOSSIBLE";
  }
  const index = DIFFICULTIES.findIndex((el) => el === result);
  const difficultiesPossible = DIFFICULTIES.filter(
    (el, i) => i <= index && i >= index - 1
  );
  return difficultiesPossible;
};

async function getQuestion(supabase, channel, game) {
  const theme = game.theme;
  let themequestion = game.themequestion;
  if (theme.id === 271) {
    const resrandomtheme = await supabase
      .from("randomtheme")
      .select("*")
      .is("enabled", true)
      .not("id", "in", `(271,272)`)
      .limit(1)
      .maybeSingle();
    if (resrandomtheme.error) throw resrandomtheme.error;
    themequestion = resrandomtheme.data;
  }

  const points = game.points;
  const difficulties = getDifficultyQuestion(points);
  const previousIdQuestion = game.questions.map((el) => el.id).join(",");
  const uuid = game.uuid;
  const player = game.player;

  let newQuestion: any = undefined;
  const isGenerate =
    theme.generatequestion !== null
      ? theme.generatequestion
      : Math.random() < 0.5;
  let responsesQcm: Array<any> = [];
  if (isGenerate) {
    const difficulty = difficulties[difficulties.length - 1];
    newQuestion = generateQuestion(Number(theme.id), points, difficulty);
  } else {
    const resrandomquestion = await supabase
      .from("randomquestion")
      .select("*, theme(*)")
      .eq("theme", themequestion.id)
      .in("difficulty", difficulties)
      .not("id", "in", `(${previousIdQuestion})`)
      .limit(1)
      .maybeSingle();
    if (resrandomquestion.error) throw resrandomquestion.error;
    newQuestion = resrandomquestion.data;
    if (newQuestion === null) {
      const resrandomquestion2 = await supabase
        .from("randomquestion")
        .select("*, theme(*)")
        .eq("theme", themequestion.id)
        .not("id", "in", `(${previousIdQuestion})`)
        .limit(1)
        .maybeSingle();
      if (resrandomquestion2.error) throw resrandomquestion2.error;
      newQuestion = resrandomquestion2.data;
      if (newQuestion === null) {
        channel.send({
          type: "broadcast",
          event: "allquestion",
          payload: { uuid: uuid },
        });
        const resupdatescore = await supabase.rpc("updatescore", {
          player: player,
          themeid: theme.id,
          newpoints: points,
        });
        if (resupdatescore.error) throw resupdatescore.error;
        channel.unsubscribe();
        supabase.removeChannel(channel);
      }
    }
    if (newQuestion) {
      const qcm = newQuestion.isqcm === null ? points < 10 : newQuestion.isqcm;
      newQuestion = { ...newQuestion, time: qcm ? 10 : 15, isqcm: qcm };
      if (qcm) {
        if (newQuestion.typequestion === "ORDER") {
          const res = await supabase
            .from("order")
            .select("*")
            .eq("type", newQuestion.typeResponse)
            .limit(4);
          if (res.error) throw res.error;
          responsesQcm = [...res.data]
            .map((el) => ({ label: el.name }))
            .sort(() => Math.random() - 0.5);
          const responseOrder =
            newQuestion.order === "ASC"
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
          const response = [...responsesQcm].findIndex(
            (el) => el.label === responseOrder.name
          );
          newQuestion = { ...newQuestion, response };
        } else if (newQuestion.typequestion === "IMAGE") {
          const responses = Array.isArray(newQuestion.response["fr-FR"])
            ? newQuestion.allresponse
              ? newQuestion.response["fr-FR"]
              : [newQuestion.response["fr-FR"][0]]
            : [newQuestion.response["fr-FR"]];

          const results = await Promise.all([
            supabase
              .from("randomresponseimage")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .not("usvalue", "in", `(${responses.join(",")})`)
              .limit(3),
            supabase
              .from("randomresponseimage")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .in("usvalue", responses)
              .limit(1),
          ]);
          const res = results[0];
          const res2 = results[1];
          if (res.error) throw res.error;
          if (res2.error) throw res2.error;
          responsesQcm = [...res.data, ...res2.data]
            .map((el) => ({ image: el.image }))
            .sort(() => Math.random() - 0.5);

          const response = [...responsesQcm].findIndex(
            (el) => el.image === res2.data[0].image
          );
          newQuestion = { ...newQuestion, response };
        } else if (newQuestion.typequestion === "QCM") {
          responsesQcm = [...newQuestion.responses, newQuestion.response]
            .map((el) => ({ label: el }))
            .sort(() => Math.random() - 0.5);

          const response = [...responsesQcm].findIndex(
            (el) => el.label === newQuestion.response
          );
          newQuestion = { ...newQuestion, response };
        } else {
          const responses = Array.isArray(newQuestion.response["fr-FR"])
            ? newQuestion.allresponse
              ? newQuestion.response["fr-FR"]
              : [newQuestion.response["fr-FR"][0]]
            : [newQuestion.response["fr-FR"]];

          const results = await Promise.all([
            supabase
              .from("randomresponse")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .not("usvalue", "in", `(${responses.join(",")})`)
              .limit(3),
            supabase
              .from("randomresponse")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .in("usvalue", responses)
              .limit(1),
          ]);
          const res = results[0];
          const res2 = results[1];
          if (res.error) throw res.error;
          if (res2.error) throw res2.error;

          responsesQcm = [...res.data, ...res2.data]
            .map((el) => ({ label: el.value }))
            .sort(() => Math.random() - 0.5);

          const response = [...responsesQcm].findIndex(
            (el) => el.label === res2.data[0].value
          );
          newQuestion = { ...newQuestion, response };
        }
        newQuestion.responses = [...responsesQcm];
      }
    }
  }
  return newQuestion;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const uuid = body.game;

    const sologame = await supabase
      .from("sologame")
      .select("*, theme!public_sologame_theme_fkey(*), themequestion(*)")
      .eq("uuid", uuid)
      .maybeSingle();
    if (sologame.error) throw sologame.error;
    const game = sologame.data;
    console.log(uuid);

    const channel = supabase.channel(uuid);
    const question = await getQuestion(supabase, channel, game);
    const { error } = await supabase
      .from("sologame")
      .update({
        time: moment().add(question.time, "seconds"),
        question: question,
      })
      .eq("uuid", game.uuid);
    if (error) throw error;
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
        time: question.time,
      },
    });
    supabase.removeChannel(channel);

    return new Response(JSON.stringify(true), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
