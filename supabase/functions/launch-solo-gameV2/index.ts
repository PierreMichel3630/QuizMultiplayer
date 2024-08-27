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
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const player = body.player;
    const theme = body.theme;
    let themequestion = body.theme;
    if (theme === 272) {
      const resRandomTheme = await supabase
        .from("randomtheme")
        .select("*")
        .is("enabled", true)
        .not("id", "in", `(271,272)`)
        .limit(1)
        .maybeSingle();
      if (resRandomTheme.error) throw resRandomTheme.error;
      themequestion = resRandomTheme.data.id;
    }

    const game = {
      player: player,
      theme: theme,
      themequestion: themequestion,
      points: 0,
    };

    const { error, data } = await supabase
      .from("sologame")
      .insert(game)
      .select()
      .maybeSingle();
    if (error) throw error;
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
