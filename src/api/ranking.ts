import { supabase } from "./supabase";

const SUPABASE_FINISHTHEME_TABLE = "viewfinishtheme";

export const getFinishThemeByProfile = (profile: string) => {
  return supabase
    .from(SUPABASE_FINISHTHEME_TABLE)
    .select("*")
    .eq("profile", profile)
    .maybeSingle();
};
