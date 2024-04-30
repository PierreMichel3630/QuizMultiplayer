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
  const player = body.player;
  const theme = body.theme;

  const game = {
    player: player,
    theme: theme,
    points: 0,
  };

  const { data } = await supabase
    .from("sologame")
    .insert(game)
    .select()
    .maybeSingle();
  setTimeout(async () => {
    await supabase.functions.invoke("response-solo-game", {
      body: { game: data.id },
    });
  }, 1000);
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
