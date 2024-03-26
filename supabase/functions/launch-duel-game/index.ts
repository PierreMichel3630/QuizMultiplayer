import { createClient } from "https://esm.sh/@supabase/supabase-js";

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
  const player1 = body.player1;
  const player2 = body.player2;
  const theme = body.theme;
  let start = false;

  const game = {
    player1: player1,
    player2: player2,
    theme: theme,
  };

  const { data } = await supabase
    .from("duelgame")
    .insert(game)
    .select()
    .maybeSingle();

  const channel = supabase.channel(data.uuid, {
    config: {
      presence: {
        key: "uuid",
      },
    },
  });
  channel
    .on("presence", { event: "sync" }, async () => {
      const newState = channel.presenceState();
      const uuids = newState.uuid
        ? newState.uuid
            .map((el) => el.uuid)
            .filter((el) => el === data.player1 || el === data.player2)
        : [];
      if (uuids.length === 2) {
        channel.unsubscribe();
        await supabase
          .from("duelgame")
          .update({ start: true })
          .eq("uuid", data.uuid);
        start = true;
        setTimeout(async () => {
          await supabase.functions.invoke("response-duel-game", {
            body: { game: data.uuid },
          });
        }, 5000);
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setTimeout(async () => {
          if (!start) {
            channel.send({
              type: "broadcast",
              event: "endgame",
              payload: {
                response: true,
              },
            });
            await supabase.from("duelgame").delete().eq("uuid", data.uuid);
            channel.unsubscribe();
          }
        }, 30000);
      }
    });
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
