import { createClient } from "supabase";
import moment from "moment";
import { getRandomElement } from "../_shared/random.ts";

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
    const MINTIMEDIFF = 12; // 12 Heures
    const body = await req.json();
    const theme = body.theme;

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const resUser = await supabase.auth.getUser(token);
    const user = resUser.data.user;
    const resProfile = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .maybeSingle();
    const profile = resProfile.data;

    const timeHours =
      profile.datevote !== null
        ? moment().diff(moment(profile.datevote), "hours")
        : MINTIMEDIFF;

    if (timeHours >= MINTIMEDIFF) {
      await supabase
        .from("profiles")
        .update({ datevote: new Date() })
        .eq("id", user.id);
      const resVoteTheme = await supabase.from("votetheme").select().eq("id", theme.id).maybeSingle();
      if (resVoteTheme.data !== null) {
        const vote = resVoteTheme.data.vote +1 ;
        await supabase
          .from("votetheme")
          .update({ vote: vote})
          .eq("id", theme.id);
        return new Response(JSON.stringify(true), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify(false), {
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
