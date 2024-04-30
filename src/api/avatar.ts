import { supabase } from "./supabase";

export const SUPABASE_AVATAR_TABLE = "avatar";

export const selectAvatar = () => supabase.from(SUPABASE_AVATAR_TABLE).select();
