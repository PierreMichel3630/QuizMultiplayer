import { supabase } from "./supabase";

const SUPABASE_LANGUAGE_TABLE = "language";

export const selectLanguages = () =>
  supabase
    .from(SUPABASE_LANGUAGE_TABLE)
    .select("*")
    .eq("activate", true)
    .order("id");
