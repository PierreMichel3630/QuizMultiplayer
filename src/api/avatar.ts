import { AvatarInsert, AvatarUpdate } from "src/models/Avatar";
import { supabase } from "./supabase";

export const SUPABASE_AVATARPROFILE_TABLE = "avatarprofile";
export const SUPABASE_AVATAR_TABLE = "avatar";

export const selectAvatar = () => supabase.from(SUPABASE_AVATAR_TABLE).select();

export const selectAvatarFree = () =>
  supabase
    .from(SUPABASE_AVATAR_TABLE)
    .select()
    .eq("price", 0)
    .eq("isaccomplishment", false);

export const selectAvatarByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_AVATARPROFILE_TABLE)
    .select("*, avatar(*)")
    .eq("profile", profile);

export const selectAvatarById = (id: number) =>
  supabase.from(SUPABASE_AVATAR_TABLE).select("*").eq("id", id).maybeSingle();

export const insertAvatar = (value: AvatarInsert) =>
  supabase.from(SUPABASE_AVATAR_TABLE).insert(value).select().single();

export const updateAvatar = (value: AvatarUpdate) =>
  supabase
    .from(SUPABASE_AVATAR_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();
