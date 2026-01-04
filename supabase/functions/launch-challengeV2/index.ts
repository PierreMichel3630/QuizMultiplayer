import { createClient } from "https://esm.sh/@supabase/supabase-js";
import moment from "https://esm.sh/moment";

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
    const body = await req.json();
    const date = body.date;

    const dateDay = moment(date);
    const dateLastPlayChallenge = moment(profile.lastchallengeplay);
    const diffDays = dateDay.diff(dateLastPlayChallenge, "days");

    await supabase
      .from("profiles")
      .update({
        streak: diffDays === 1 ? profile.streak + 1 : profile.streak,
        isonline: true,
        lastconnection: dateDay,
      })
      .eq("id", user.id);

    const resChallenge = await supabase
      .from("challenge")
      .select()
      .eq("date", date)
      .maybeSingle();
    const challenge = resChallenge.data;

    const game = {
      profile: profile.id,
      challenge: challenge.id,
    };

    const { error, data } = await supabase
      .from("challengegame")
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
