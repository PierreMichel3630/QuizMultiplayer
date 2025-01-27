import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";
import { generateQuestion } from "../_shared/generateQuestion.ts";

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
  console.log(uuidgame);
  if (endgame) {
    await supabase.from("traininggame").delete().eq("uuid", uuidgame);
    return new Response(null, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } else {
    const res = await supabase
      .from("traininggame")
      .select("*, themequestion(*)")
      .eq("uuid", uuidgame)
      .maybeSingle();
    const data = res.data;
    const id = data.id;
    const config =
      data.config !== null
        ? data.config
        : {
            inputquestion: true,
            qcmquestion: true,
          };

    let themequestion = data.themequestion;
    if (themequestion.id === 271) {
      const { data } = await supabase
        .from("randomtheme")
        .select("*")
        .is("enabled", true)
        .not("id", "in", `(271,272)`)
        .limit(1)
        .maybeSingle();
      themequestion = data;
    }
    const questions = data.questions;
    const previousIdQuestion = questions.map((el) => el.id).join(",");
    const previousQuestion =
      questions.length > 0 ? questions[questions.length - 1].id : undefined;

    let response = undefined;

    let newQuestion: any = undefined;
    const isGenerate =
      themequestion.generatequestion !== null
        ? themequestion.generatequestion
        : Math.random() < 0.5;
    let responsesQcm: Array<any> = [];
    if (isGenerate) {
      let qcm: boolean | undefined = undefined;
      if (!config.inputquestion && config.qcmquestion) {
        qcm = true;
      } else if (config.inputquestion && !config.qcmquestion) {
        qcm = false;
      }
      newQuestion = generateQuestion(Number(themequestion.id), qcm);
      response = newQuestion.response;
    } else {
      let query = supabase
        .from("randomquestion")
        .select("*, theme(*)")
        .eq("theme", themequestion.id)
        .not("id", "in", `(${previousIdQuestion})`);
      if (!config.inputquestion && config.qcmquestion) {
        query = query.or("isqcm.is.true,isqcm.is.null");
      } else if (config.inputquestion && !config.qcmquestion) {
        query = query.or("isqcm.is.false,isqcm.is.null");
      }
      let result = undefined;
      if (previousQuestion !== undefined) {
        const respreviousresponse = await supabase
          .from("question")
          .select("response")
          .eq("id", previousQuestion)
          .maybeSingle();

        if (respreviousresponse.data !== null) {
          const response = respreviousresponse.data.response["fr-FR"];
          if (Array.isArray(response)) {
            result = response[0];
          } else {
            result = response;
          }
          query = query.neq("response->fr-FR->>0", result);
        }
      }

      const { data } = await query.limit(1).maybeSingle();
      newQuestion = data;
      if (data === null) {
        return new Response(null, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 204,
        });
      }
      if (newQuestion) {
        let qcm = true;
        if (config.inputquestion && config.qcmquestion) {
          qcm =
            newQuestion.isqcm === null
              ? Math.random() < 0.5
              : newQuestion.isqcm;
        } else if (config.inputquestion && !config.qcmquestion) {
          qcm = false;
        }
        newQuestion = { ...newQuestion, isqcm: qcm };
        response = newQuestion.response;
        if (qcm) {
          if (newQuestion.typequestion === "ORDER") {
            const res = await supabase
              .from("responseorder")
              .select("*")
              .eq("type", newQuestion.typeResponse)
              .limit(2);
            responsesQcm = [...res.data]
              .map((el) => ({
                label: el.name,
                image: el.image,
                extra: {
                  value: el.value,
                  type: el.typedata,
                  format: el.formatdata,
                },
              }))
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
          } else if (newQuestion.typequestion === "QCM") {
            responsesQcm = [...newQuestion.responses, newQuestion.response]
              .map((el) => ({ label: el }))
              .sort(() => Math.random() - 0.5);

            response = [...responsesQcm].findIndex(
              (el) => el.label === newQuestion.response
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
      typequestion: newQuestion.typequestion,
      typeResponse: newQuestion.typeresponselist,
      responses: newQuestion.responses,
      response: response,
      data: newQuestion.data,
    };

    return new Response(JSON.stringify(dataSend), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
