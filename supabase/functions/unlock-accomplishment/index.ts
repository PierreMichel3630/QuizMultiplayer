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
    const authHeader = req.headers.get("Authorization")!;
    const jwt = authHeader.split("Bearer ")[1];
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data } = await supabase.auth.getUser(jwt);

    const body = await req.json();
    const id = body.id;
    const iduser = data.user.id;

    const res = await supabase
      .from("profileaccomplishment")
      .select("*, accomplishment(*)")
      .eq("accomplishment.id", id)
      .not("accomplishment", "is", null)
      .eq("profile", iduser)
      .eq("validate", false)
      .maybeSingle();

    const profileaccomplishment = res.data;

    if (profileaccomplishment !== null) {
      const res2 = await supabase.rpc("updatexp", {
        value: profileaccomplishment.accomplishment.xp,
        iduser: iduser,
      });
      if (res2.error) throw res2.error;
      const res3 = await supabase.rpc("updatemoney", {
        value: profileaccomplishment.accomplishment.gold,
        row_id: iduser,
      });
      if (res3.error) throw res3.error;
      await supabase
        .from("profileaccomplishment")
        .update({ validate: true })
        .eq("id", profileaccomplishment.id);

      return new Response(JSON.stringify(true), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    return new Response(JSON.stringify({ error: "NOT FOUND" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
