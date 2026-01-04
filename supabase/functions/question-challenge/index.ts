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

async function getQuestion(supabase, game) {
  const questions = game.challenge.questions;
  console.log(questions);
  const currentquestion = game.question;
  console.log(currentquestion);
  let idnextquestion = questions[0];
  if (currentquestion !== null) {
    const indexQuestion = questions.findIndex(
      (el) => Number(el) === Number(currentquestion.id)
    );
    console.log(indexQuestion);
    idnextquestion = questions[indexQuestion + 1];
  }
  let newQuestion: any = undefined;
  let responsesQcm: Array<any> = [];
  console.log(idnextquestion);
  const resquestion = await supabase
    .from("randomquestion")
    .select("*, theme(*)")
    .eq("id", idnextquestion)
    .limit(1)
    .single();
  console.log(resquestion);
  if (resquestion.error) throw resquestion.error;
  newQuestion = resquestion.data;

  if (newQuestion) {
    const qcm = newQuestion.isqcm === null ? true : newQuestion.isqcm;
    newQuestion = { ...newQuestion, time: 20, isqcm: qcm };
    if (qcm) {
      if (newQuestion.typequestion === "ORDER") {
        const previousIdResponsesOrder = [...game.questions].reduce(
          (acc, value) => {
            const responses = [...value.responses]
              .filter((el) => el.type === newQuestion.typeResponse)
              .map((el) => el.id);
            return [...acc, ...responses];
          },
          []
        );
        const res = await supabase
          .from("randomresponseorder")
          .select("*")
          .eq("type", newQuestion.typeResponse)
          .not("id", "in", `(${previousIdResponsesOrder})`)
          .limit(2);
        if (res.error) throw res.error;
        responsesQcm = [...res.data]
          .map((el) => ({
            label: el.name,
            image: el.image,
            extra: {
              value: el.value,
              type: el.typedata,
              format: el.formatdata,
              unit: el.unit,
            },
            id: el.id,
            type: el.type,
          }))
          .sort(() => Math.random() - 0.5);
        const responseOrder =
          newQuestion.order === "ASC"
            ? [...res.data].sort((a, b) =>
                a.format === "DATE"
                  ? moment(a.value, a.formatdata).diff(
                      moment(b.value, b.formatdata)
                    )
                  : a.value - b.value
              )[0]
            : [...res.data].sort((a, b) =>
                a.format === "DATE"
                  ? moment(b.value, b.formatdata).diff(
                      moment(a.value, a.formatdata)
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

    const resChallengeGame = await supabase
      .from("challengegame")
      .select("*, challenge(*)")
      .eq("uuid", uuid)
      .maybeSingle();
    if (resChallengeGame.error) throw resChallengeGame.error;
    const game = resChallengeGame.data;
    console.log(uuid);

    const question = await getQuestion(supabase, game);
    supabase
      .from("challengegame")
      .update({
        timequestion: moment().add(question.time, "seconds"),
        question: question,
      })
      .eq("uuid", game.uuid)
      .then(({ error }) => {
        if (error) throw error;
      });

    return new Response(
      JSON.stringify({
        question: question.question,
        difficulty: question.difficulty,
        image: question.image,
        audio: question.audio,
        extra: question.extra,
        theme: question.theme,
        isqcm: question.isqcm,
        typequestion: question.typequestion,
        responses: question.responses,
        time: question.time,
        typeResponse: question.typeresponselist,
        data: question.data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
