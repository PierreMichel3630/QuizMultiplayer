import { supabase } from "./supabase";

export const SUPABASE_SCORE_TABLE = "score";

export const selectScoresByTheme = (theme: number, order: string) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, profile(*)")
    .eq("theme", theme)
    .order(order, { ascending: false })
    .limit(10);

export const selectScoreByThemeAndPlayer = (player: string, theme: number) =>
  supabase.rpc("getranking", {
    player: player,
    themeid: theme,
  });
