import { supabase } from "./supabase";

export const SUPABASE_TITLEPROFILE_TABLE = "titleprofile";

export const SUPABASE_TITLE_TABLE = "title";

export const selectTitles = () => supabase.from(SUPABASE_TITLE_TABLE).select();

export const selectTitleByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_TITLEPROFILE_TABLE)
    .select("*, title(*)")
    .eq("profile", profile);

export const selectTitleById = (id: number) =>
  supabase.from(SUPABASE_TITLE_TABLE).select("*").eq("id", id).maybeSingle();
