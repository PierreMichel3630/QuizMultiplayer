import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";
import { DIFFICULTIES, getRandomElement } from "../_shared/random.ts";
import {
  GENERATETHEME,
  generateQuestion,
} from "../_shared/generateQuestion.ts";
import { verifyResponse } from "../_shared/response.ts";

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
  const idgame = body.game;
  const { data } = await supabase
    .from("sologame")
    .select("*, theme(*)")
    .eq("id", idgame)
    .maybeSingle();
  const id = data.id;
  const theme = data.theme;
  const player = data.player;
  let points = data.points;
  const questions = data.questions;
  const previousIdQuestion = questions.map((el) => el.id).join(",");
  let response = undefined;
  let question = undefined;
  let isAnswer = false;

  const randomTheme = getRandomElement(theme.themes);
  const difficulties = getDifficultyQuestion(points);

  const channel = supabase.channel(data.uuid);
  channel
    .on("broadcast", { event: "response" }, async (v) => {
      let result = false;
      const payload = v.payload;
      const value = payload.response.toLowerCase();
      const language = payload.language;

      if (response) {
        isAnswer = true;
        result = verifyResponse(response[language], value);
        points = result ? points + 1 : points;
        channel.send({
          type: "broadcast",
          event: "validate",
          payload: {
            result: result,
            response: response,
            answer: payload.response,
            points,
          },
        });
        if (result) {
          await supabase
            .from("sologame")
            .update({ points: points, questions: [...questions, question] })
            .eq("id", id);
          setTimeout(async () => {
            await supabase.functions.invoke("response-solo-game", {
              body: { game: idgame },
            });
          }, 2000);
        } else {
          await supabase
            .from("sologame")
            .update({ questions: [...questions, question] })
            .eq("id", id);
          await supabase.rpc("updatescore", {
            player: player,
            themeid: theme.id,
            newpoints: points,
          });
          setTimeout(async () => {
            await supabase.from("sologame").delete().eq("id", id);
          }, 2000);
        }
        channel.unsubscribe();
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        let newQuestion: any = undefined;
        if (GENERATETHEME.includes(Number(randomTheme))) {
          const difficulty = difficulties[difficulties.length - 1];
          newQuestion = generateQuestion(Number(randomTheme), difficulty);
        } else {
          const { data } = await supabase
            .from("randomquestion")
            .select("*, theme(*)")
            .in("theme", theme.themes)
            .in("difficulty", difficulties)
            .not("id", "in", `(${previousIdQuestion})`)
            .limit(1)
            .maybeSingle();
          newQuestion = data;
          if (data === null) {
            const { data } = await supabase
              .from("randomquestion")
              .select("*, theme(*)")
              .in("theme", theme.themes)
              .in("difficulty", DIFFICULTIES)
              .not("id", "in", `(${previousIdQuestion})`)
              .limit(1)
              .maybeSingle();
            newQuestion = data;
            if (data === null) {
              channel.send({
                type: "broadcast",
                event: "allquestion",
                payload: {
                  result: true,
                },
              });
              setTimeout(async () => {
                await supabase.from("sologame").delete().eq("id", id);
              }, 2000);
            }
          }
        }
        if (newQuestion) {
          question = newQuestion;
          response = newQuestion.response;
          let responsesQcm: Array<any> = [];
          const qcm =
            newQuestion.isqcm === null
              ? Math.random() < 1 - 0.05 * points
              : newQuestion.isqcm;
          if (qcm) {
            const responses = Array.isArray(newQuestion.response["en-US"])
              ? newQuestion.allresponse
                ? newQuestion.response["en-US"]
                : [newQuestion.response["en-US"][0]]
              : [newQuestion.response["en-US"]];

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
              .map((el) => el.value)
              .sort(() => Math.random() - 0.5);
          }
          channel.send({
            type: "broadcast",
            event: "question",
            payload: {
              question: newQuestion.question,
              difficulty: newQuestion.difficulty,
              image: newQuestion.image,
              theme: newQuestion.theme,
              isqcm: qcm,
              responses: responsesQcm,
            },
          });
          setTimeout(async () => {
            if (!isAnswer) {
              await supabase
                .from("sologame")
                .update({ questions: [...questions, question] })
                .eq("id", id);
              channel.send({
                type: "broadcast",
                event: "validate",
                payload: {
                  result: false,
                  answer: "",
                  response: response,
                  points,
                },
              });
              setTimeout(async () => {
                await supabase.from("sologame").delete().eq("id", id);
              }, 2000);
              await supabase.rpc("updatescore", {
                player: player,
                themeid: theme.id,
                newpoints: points,
              });
              channel.unsubscribe();
            }
          }, 15000);
        }
      }
    });

  return new Response(JSON.stringify(true), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
