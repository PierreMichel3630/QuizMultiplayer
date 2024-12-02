import { supabase } from "./supabase";

export const test = async () => {
  const res = await supabase
    .from("randomresponse")
    .select("*")
    .eq("type", "MONSTREYUGIOH")
    .not("usvalue", "in", `Alpha, Le Guerrier Magnétique`)
    .limit(3);
  console.log(res);
};
