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
  const config = body.config;
  let themequestion = body.theme;
  if (theme === 272) {
    const { data } = await supabase
      .from("randomtheme")
      .select("*")
      .is("enabled", true)
      .not("id", "in", `(271,272)`)
      .limit(1)
      .maybeSingle();
    themequestion = data.id;
  }

  const game = {
    player: player,
    theme: theme,
    themequestion: themequestion,
    questions: [],
    config: config,
  };

  const res = await supabase
    .from("traininggame")
    .insert(game)
    .select()
    .maybeSingle();

  return new Response(JSON.stringify(res.data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
