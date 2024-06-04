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
  let returnData = undefined;

  const res = await supabase
    .from("duelgame")
    .select()
    .eq("theme", theme)
    .or(
      `and(player1.eq.${player1},player2.eq.${player2}),and(player1.eq.${player2},player2.eq.${player1})`
    );
  if (res.data.length > 0) {
    returnData = res.data[0];
  } else {
    const { data } = await supabase
      .from("duelgame")
      .insert(game)
      .select()
      .maybeSingle();
    returnData = data;
    const channel = supabase.channel(data.uuid, {
      config: {
        presence: {
          key: "uuid",
        },
      },
    });
    channel
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "duelgame",
        },
        (payload) => {
          if (payload.old.id === data.id) {
            channel.send({
              type: "broadcast",
              event: "cancel",
              payload: {
                response: true,
              },
            });
            channel.unsubscribe();
          }
        }
      )
      .on("presence", { event: "sync" }, async () => {
        const newState = channel.presenceState();
        const uuids = newState.uuid
          ? newState.uuid
              .map((el) => el.uuid)
              .filter((el) => el === data.player1 || el === data.player2)
          : [];
        if (uuids.length === 2) {
          const res = await supabase
            .from("duelgame")
            .update({ start: true })
            .eq("uuid", data.uuid)
            .select(
              "*,theme(*),player1(*,avatar(*),title(*), badge(*)),player2(*,avatar(*),title(*), badge(*))"
            )
            .maybeSingle();
          channel.send({
            type: "broadcast",
            event: "updategame",
            payload: res.data,
          });
          channel.unsubscribe();
          start = true;
          setTimeout(async () => {
            await supabase.functions.invoke("duel-game", {
              body: { game: data.uuid },
            });
          }, 3000);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setTimeout(async () => {
            if (!start) {
              channel.send({
                type: "broadcast",
                event: "cancel",
                payload: {
                  response: true,
                },
              });
              await supabase.from("duelgame").delete().eq("uuid", data.uuid);
              channel.unsubscribe();
            }
          }, 15000);
        }
      });
  }
  return new Response(JSON.stringify(returnData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
