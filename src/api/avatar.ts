import { supabase } from "./supabase";

export const SUPABASE_AVATARPROFILE_TABLE = "avatarprofile";
export const SUPABASE_AVATAR_TABLE = "avatar";

export const selectAvatar = () => supabase.from(SUPABASE_AVATAR_TABLE).select();

export const selectAvatarByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_AVATARPROFILE_TABLE)
    .select("*, avatar(*)")
    .eq("profile", profile);

export const selectAvatarById = (id: number) =>
  supabase.from(SUPABASE_AVATAR_TABLE).select("*").eq("id", id).maybeSingle();
