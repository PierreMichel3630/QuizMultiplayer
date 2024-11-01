import { supabase } from "./supabase";

export const SUPABASE_RANKINGDUEL_TABLE = "rankingduel";
export const SUPABASE_RANKINGSOLO_TABLE = "rankingsolo";

export const selectRankingSoloByTheme = (
  theme: number,
  idFriends: Array<string>,
  maxRank?: number
) =>
  supabase
    .from(SUPABASE_RANKINGSOLO_TABLE)
    .select("*,profile(*, avatar(*)), uuidgame(uuid)")
    .eq("theme", theme)
    .or(`ranking.lte.${maxRank},profile.in.(${idFriends.join(",")})`);

export const selectRankingDuelByTheme = (
  theme: number,
  idFriends: Array<string>,
  maxRank?: number
) =>
  supabase
    .from(SUPABASE_RANKINGDUEL_TABLE)
    .select("*,profile(*, avatar(*))")
    .eq("theme", theme)
    .or(`ranking.lte.${maxRank},profile.in.(${idFriends.join(",")})`);
