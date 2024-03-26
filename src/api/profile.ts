import { ProfileUpdate } from "src/models/Profile";
import { supabase } from "./supabase";

export const SUPABASE_PROFILE_TABLE = "profiles";

export const getProfil = (uuid: string) =>
  supabase.from(SUPABASE_PROFILE_TABLE).select().eq("id", uuid).single();

export const updateProfil = (profil: ProfileUpdate) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .update(profil)
    .eq("id", profil.id)
    .select()
    .single();

export const searchProfile = (search: string, notin: Array<string>) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select()
    .ilike("username", `%${search}%`)
    .not("id", "in", `(${notin.join(",")})`)
    .order("username", { ascending: true });
