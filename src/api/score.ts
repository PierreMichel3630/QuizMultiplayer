import { supabase } from "./supabase";

export const SUPABASE_SCORE_TABLE = "score";
export const SUPABASE_OPPOSITION_TABLE = "opposition";

export const selectScoresByTheme = (theme: number, order: string) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, profile(*, avatar(*))")
    .eq("theme", theme)
    .order(order, { ascending: false })
    .order("created_at", { ascending: true })
    .limit(5);

export const selectScoresByProfile = (uuid: string) =>
  supabase.from(SUPABASE_SCORE_TABLE).select("*, theme(*)").eq("profile", uuid);

export const selectScoreByThemeAndPlayer = (player: string, theme: number) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*")
    .eq("profile", player)
    .eq("theme", theme)
    .maybeSingle();

export const selectScore = (order: string, limit = 25) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, profile(*, avatar(*)), theme(*)")
    .order(order, { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);

export const countPlayersByTheme = (theme: number) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("theme", theme);

//Opposition

export const selectOppositionByOpponent = (player1: string, player2: string) =>
  supabase
    .from(SUPABASE_OPPOSITION_TABLE)
    .select("*")
    .eq("player1", player1)
    .eq("player2", player2);
