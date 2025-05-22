import { supabase } from "./supabase";

export const SUPABASE_RANKINGDUEL_TABLE = "rankingduel";
export const SUPABASE_RANKINGSOLO_TABLE = "rankingsolo";
export const SUPABASE_FINISHTHEME_TABLE = "viewfinishtheme";

export const selectRankingSoloByTheme = (
  theme: number,
  idFriends: Array<string>,
  maxRank?: number
) =>
  supabase
    .from(SUPABASE_RANKINGSOLO_TABLE)
    .select("*,profile(*, avatar(*), country(*)), uuidgame(uuid)")
    .eq("theme", theme)
    .or(`ranking.lte.${maxRank},profile.in.(${idFriends.join(",")})`);

export const selectRankingDuelByTheme = (
  theme: number,
  idFriends: Array<string>,
  maxRank?: number
) =>
  supabase
    .from(SUPABASE_RANKINGDUEL_TABLE)
    .select("*,profile(*, avatar(*), country(*))")
    .eq("theme", theme)
    .or(`ranking.lte.${maxRank},profile.in.(${idFriends.join(",")})`);

export const getRankingFinishTheme = (page: number, itemperpage = 25) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_FINISHTHEME_TABLE)
    .select("*,profile(*, avatar(*), country(*))")
    .order("nbtheme", { ascending: false })
    .range(from, to);
};

export const getFinishThemeByProfile = (profile: string) => {
  return supabase
    .from(SUPABASE_FINISHTHEME_TABLE)
    .select("*")
    .eq("profile", profile)
    .maybeSingle();
};
