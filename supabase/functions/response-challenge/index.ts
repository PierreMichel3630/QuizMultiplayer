import { createClient } from "supabase";
import moment from "moment";

import { verifyResponse } from "../_shared/response.ts";

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
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const timeresponse = moment();
    const body = await req.json();
    const uuid = body.game;
    const value = body.response;
    const exact = body.exact;
    const language = body.language;

    const resChallengeGame = await supabase
      .from("challengegame")
      .select("*, challenge(*)")
      .eq("uuid", uuid)
      .maybeSingle();
    if (resChallengeGame.error) throw resChallengeGame.error;
    const game = resChallengeGame.data;
    const question = game.question;
    const timequestion = moment(game.timequestion).add(1500, "milliseconds");
    let score = game.score;
    const isBefore = timeresponse.isBefore(timequestion);
    console.log(uuid);

    let result: boolean = false;
    if (question !== undefined) {
      if (value !== undefined && isBefore) {
        if (question.isqcm) {
          result = Number(question.response) === Number(value);
        } else {
          result = verifyResponse(
            question.response[language],
            value,
            exact ? exact : question.exact
          );
        }
      }
      score = result ? game.score + 1 : game.score;

      const time = moment().diff(moment(game.created_at), "millisecond");
      const questions = [
        ...game.questions,
        {
          ...question,
          responsePlayer1: isBefore ? value : undefined,
          resultPlayer1: result,
        },
      ];

      const { error } = await supabase
        .from("challengegame")
        .update({
          score,
          questions,
          time,
          status: questions.length === 10 ? "END" : "START",
        })
        .eq("uuid", uuid);
      if (error) throw error;
    }

    return new Response(
      JSON.stringify({
        result: result,
        response: question.response,
        answer: isBefore ? value : undefined,
        score,
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
