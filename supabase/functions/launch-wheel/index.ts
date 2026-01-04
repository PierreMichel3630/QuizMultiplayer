import { createClient } from "supabase";
import moment from "moment";
import { getRandomElement } from "../_shared/random.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

enum TypeWheelEnum {
  GOLD = "GOLD",
  XP = "XP",
}

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
    const options = [
      {
        value: "1000",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "500",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "1000",
        type: TypeWheelEnum.XP,
      },
      {
        value: "250",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "5000",
        type: TypeWheelEnum.XP,
      },
      {
        value: "50",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "100",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "1000",
        type: TypeWheelEnum.XP,
      },
      {
        value: "250",
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        type: TypeWheelEnum.GOLD,
      },
    ];

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const resUser = await supabase.auth.getUser(token);
    const user = resUser.data.user;
    const resProfile = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .maybeSingle();
    const resStat = await supabase
      .from("stataccomplishment")
      .select()
      .eq("profile", user.id)
      .maybeSingle();
    const profile = resProfile.data;
    const stat = resStat.data;

    const timeHours =
      profile.wheellaunch !== null
        ? moment().diff(moment(profile.wheellaunch), "hours")
        : MINTIMEDIFF;
    const previousmoney = profile.money;
    let newmoney = profile.money;

    const previousxp = stat.xp;
    let newxp = stat.xp;
    let option: any = undefined;
    if (timeHours >= MINTIMEDIFF) {
      option = getRandomElement(options);
      const value = Number(option.value);

      newmoney =
        option.type === TypeWheelEnum.GOLD
          ? previousmoney + value
          : previousmoney;
      newxp =
        option.type === TypeWheelEnum.XP ? previousxp + value : previousxp;

      await supabase
        .from("profiles")
        .update({ money: newmoney, wheellaunch: new Date() })
        .eq("id", user.id);

      await supabase
        .from("stataccomplishment")
        .update({ xp: newxp })
        .eq("profile", user.id);
    }

    return new Response(
      JSON.stringify({
        money: {
          previous: previousmoney,
          actual: newmoney,
        },
        xp: {
          previous: previousxp,
          actual: newxp,
        },
        option,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
