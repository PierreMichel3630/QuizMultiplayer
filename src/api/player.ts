import { supabase } from "./supabase";

export const SUPABASE_PLAYER_TABLE = "publicgameplayer";

export const selectPlayersByTheme = (id: number) =>
  supabase.from(SUPABASE_PLAYER_TABLE).select().eq("theme", id);
