import { supabase } from "./supabase";

export const SUPABASE_CONFIG_TABLE = "config";

export const selectConfig = () =>
  supabase.from(SUPABASE_CONFIG_TABLE).select("*").limit(1).single();
