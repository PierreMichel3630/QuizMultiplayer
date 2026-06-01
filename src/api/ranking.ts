import { supabase } from "./supabase";

const SUPABASE_RANKINGDUEL_TABLE = "rankingduel";
const SUPABASE_RANKINGSOLO_TABLE = "rankingsolo";
const SUPABASE_FINISHTHEME_TABLE = "viewfinishtheme";

export const selectRankingSoloByThemeAndProfile = (
  theme: number,
  idFriends: Array<string>,
  maxRank?: number,
) =>
  supabase
    .from(SUPABASE_RANKINGSOLO_TABLE)
    .select(
      "*,profile(*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))), uuidgame(uuid)",
    )
    .eq("theme", theme)
    .or(`ranking.lte.${maxRank},profile.in.(${idFriends.join(",")})`);

export const selectRankingDuelByThemeAndProfile = (
  theme: number,
  idFriends: Array<string>,
  maxRank?: number,
) =>
  supabase
    .from(SUPABASE_RANKINGDUEL_TABLE)
    .select(
      "*,profile(*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))",
    )
    .eq("theme", theme)
    .or(`ranking.lte.${maxRank},profile.in.(${idFriends.join(",")})`);

export const getFinishThemeByProfile = (profile: string) => {
  return supabase
    .from(SUPABASE_FINISHTHEME_TABLE)
    .select("*")
    .eq("profile", profile)
    .maybeSingle();
};
