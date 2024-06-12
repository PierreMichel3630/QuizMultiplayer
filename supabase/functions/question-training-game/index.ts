import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";
import { generateQuestion } from "../_shared/generateQuestion.ts";
import { DIFFICULTIES } from "../_shared/random.ts";

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
  const uuidgame = body.game;
  const endgame = body.delete;
  if (endgame) {
    await supabase.from("traininggame").delete().eq("uuid", uuidgame);
    return new Response(null, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } else {
    const { data } = await supabase
      .from("traininggame")
      .select("*, theme(*)")
      .eq("uuid", uuidgame)
      .maybeSingle();
    const id = data.id;
    const theme = data.theme;
    const questions = data.questions;
    const previousIdQuestion = questions.map((el) => el.id).join(",");

    let response = undefined;

    let newQuestion: any = undefined;
    const isGenerate =
      theme.generatequestion !== null
        ? theme.generatequestion
        : Math.random() < 0.5;
    let responsesQcm: Array<any> = [];
    if (isGenerate) {
      newQuestion = generateQuestion(Number(theme.id));
      response = newQuestion.response;
    } else {
      const { data } = await supabase
        .from("randomquestion")
        .select("*, theme(*)")
        .eq("theme", theme.id)
        .in("difficulty", DIFFICULTIES)
        .not("id", "in", `(${previousIdQuestion})`)
        .limit(1)
        .maybeSingle();
      newQuestion = data;
      if (data === null) {
        const { data } = await supabase
          .from("randomquestion")
          .select("*, theme(*)")
          .eq("theme", theme.id)
          .in("difficulty", DIFFICULTIES)
          .not("id", "in", `(${previousIdQuestion})`)
          .limit(1)
          .maybeSingle();
        newQuestion = data;
        if (data === null) {
          return new Response(null, {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 204,
          });
        }
      }
      if (newQuestion) {
        const qcm = newQuestion.isqcm === null ? true : newQuestion.isqcm;
        newQuestion = { ...newQuestion, isqcm: qcm };
        response = newQuestion.response;
        if (qcm) {
          if (newQuestion.typequestion === "ORDER") {
            const res = await supabase
              .from("order")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .limit(4);
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
            response = [...responsesQcm].findIndex(
              (el) => el.label === responseOrder.name
            );
          } else if (newQuestion.typequestion === "IMAGE") {
            const responses = Array.isArray(newQuestion.response["fr-FR"])
              ? newQuestion.allresponse
                ? newQuestion.response["fr-FR"]
                : [newQuestion.response["fr-FR"][0]]
              : [newQuestion.response["fr-FR"]];

            const res = await supabase
              .from("randomresponseimage")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .not("usvalue", "in", `(${responses.join(",")})`)
              .limit(3);

            const res2 = await supabase
              .from("randomresponseimage")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .in("usvalue", responses)
              .limit(1);
            responsesQcm = [...res.data, ...res2.data]
              .map((el) => ({ image: el.image }))
              .sort(() => Math.random() - 0.5);

            response = [...responsesQcm].findIndex(
              (el) => el.image === res2.data[0].image
            );
          } else {
            const responses = Array.isArray(newQuestion.response["fr-FR"])
              ? newQuestion.allresponse
                ? newQuestion.response["fr-FR"]
                : [newQuestion.response["fr-FR"][0]]
              : [newQuestion.response["fr-FR"]];

            const res = await supabase
              .from("randomresponse")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .not("usvalue", "in", `(${responses.join(",")})`)
              .limit(3);

            const res2 = await supabase
              .from("randomresponse")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .in("usvalue", responses)
              .limit(1);
            responsesQcm = [...res.data, ...res2.data]
              .map((el) => ({ label: el.value }))
              .sort(() => Math.random() - 0.5);

            response = [...responsesQcm].findIndex(
              (el) => el.label === res2.data[0].value
            );
          }
          newQuestion.responses = [...responsesQcm];
        }
      }
    }

    await supabase
      .from("traininggame")
      .update({
        questions: [
          ...questions,
          {
            ...newQuestion,
          },
        ],
      })
      .eq("id", id);

    const dataSend = {
      question: newQuestion.question,
      difficulty: newQuestion.difficulty,
      image: newQuestion.image,
      audio: newQuestion.audio,
      extra: newQuestion.extra,
      theme: newQuestion.theme,
      isqcm: newQuestion.isqcm,
      type: newQuestion.typequestion,
      responses: newQuestion.responses,
      response: response,
    };

    return new Response(JSON.stringify(dataSend), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
