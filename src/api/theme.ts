import { supabase } from "./supabase";

export const SUPABASE_THEME_TABLE = "theme";

export const selectThemes = () =>
  supabase.from(SUPABASE_THEME_TABLE).select("*, category(*)");
//    .eq("enabled", true);

export const selectThemeById = (id: number) =>
  supabase.from(SUPABASE_THEME_TABLE).select().eq("id", id).maybeSingle();
