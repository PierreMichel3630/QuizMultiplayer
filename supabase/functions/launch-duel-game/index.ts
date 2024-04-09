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
  const bots = [
    "571b2a1c-e2ca-4e95-9d99-80a17b5796a4",
    "006c5385-8e71-41f7-801f-b6ee56f9996c",
    "931b2102-9550-4c8e-a629-fcd858293b18",
    "eed610db-4b85-4e0e-aa11-7497d5159393",
    "9e5543c3-ec9d-4a9c-8f0c-6e634759eb45",
  ];

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
    if (bots.includes(player2)) {
      await supabase
        .from("duelgame")
        .update({ start: true })
        .eq("uuid", data.uuid);
      start = true;
      setTimeout(async () => {
        await supabase.functions.invoke("response-duel-game", {
          body: { game: data.uuid },
        });
      }, 3000);
    } else {
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
            }, 3000);
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
    }
  }
  return new Response(JSON.stringify(returnData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
