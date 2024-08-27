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
    const language = body.language;

    const sologame = await supabase
      .from("sologame")
      .select("*, theme!public_sologame_theme_fkey(*), themequestion(*)")
      .eq("uuid", uuid)
      .maybeSingle();
    if (sologame.error) throw sologame.error;
    const game = sologame.data;
    const question = game.question;
    const timequestion = moment(game.time).add(1500, "milliseconds");
    let points = game.points;
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
            question.exact
          );
        }
      }
      points = result ? game.points + 1 : game.points;

      const { error } = await supabase
        .from("sologame")
        .update({
          points: points,
          questions: [
            ...game.questions,
            {
              ...question,
              responsePlayer1: isBefore ? value : undefined,
              resultPlayer1: result,
            },
          ],
          status: result ? game.status : "END",
        })
        .eq("uuid", uuid);
      if (error) throw error;

      if (!result) {
        await supabase.rpc("updatescore", {
          player: game.player,
          themeid: game.theme.id,
          newpoints: points,
          game: uuid,
          xpprop: 50 + points * 10,
        });
      }
    }

    return new Response(
      JSON.stringify({
        result: result,
        response: question.response,
        extra: !result
          ? {
              xpplayer1: {
                match: 50,
                matchscore: points * 10,
              },
            }
          : undefined,
        answer: isBefore ? value : undefined,
        points,
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
