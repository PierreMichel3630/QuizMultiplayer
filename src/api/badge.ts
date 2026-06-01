import { supabase } from "./supabase";

const SUPABASE_BADGEPROFILE_TABLE = "badgeprofile";
const SUPABASE_BADGE_TABLE = "badge";

export const selectBadges = () => supabase.from(SUPABASE_BADGE_TABLE).select();

export const selectBadgeByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_BADGEPROFILE_TABLE)
    .select("*, badge(*)")
    .eq("profile", profile);

export const selectBadgeById = (id: number) =>
  supabase.from(SUPABASE_BADGE_TABLE).select("*").eq("id", id).maybeSingle();
