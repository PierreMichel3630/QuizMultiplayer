import { supabase } from "./supabase";

export const SUPABASE_SCORE_TABLE = "score";

export const selectScoresByTheme = (theme: number) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, profile(*)")
    .eq("theme", theme)
    .order("points", { ascending: false })
    .limit(3);

export const selectScoreByThemeAndPlayer = (player: string, theme: number) =>
  supabase.rpc("getranking", {
    player: player,
    themeid: theme,
  });
