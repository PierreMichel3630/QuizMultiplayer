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
    const type = body.type;
    const id = body.id;
    const iduser = data.user.id;

    const res = await supabase.from(type).select().eq("id", id).maybeSingle();
    if (res.error) throw res.error;

    const item = {
      profile: iduser,
      [type]: id,
    };

    const res2 = await supabase.from(`${type}profile`).insert(item);
    if (res2.error) throw res2.error;

    const res3 = await supabase.rpc("updatemoney", {
      value: -res.data.price,
      row_id: iduser,
    });
    if (res3.error) throw res3.error;

    const profile = {
      [type]: id,
    };
    await supabase.from("profiles").update(profile).eq("id", iduser);

    return new Response(JSON.stringify(true), {
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
