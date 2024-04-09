import { supabase } from "./supabase";

export const SUPABASE_RANK_TABLE = "rank";

export const selectRankByProfile = (uuid: string) =>
  supabase.from(SUPABASE_RANK_TABLE).select("*, theme(*)").eq("profile", uuid);

export const selectRankByTheme = (theme: number) =>
  supabase
    .from(SUPABASE_RANK_TABLE)
    .select("*, profile(*)")
    .eq("theme", theme)
    .order("points", { ascending: false })
    .limit(5);

export const selectRankByThemeAndPlayer = (player: string, theme: number) =>
  supabase.rpc("getrankingduel", {
    player: player,
    themeid: theme,
  });
