import { ProfileUpdate } from "src/models/Profile";
import { supabase } from "./supabase";

export const SUPABASE_PROFILE_TABLE = "profiles";

export const getProfilById = (uuid: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*, avatar(*), badge(*), title(*)")
    .eq("id", uuid)
    .single();

export const updateProfil = (profil: ProfileUpdate) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .update(profil)
    .eq("id", profil.id)
    .select("*, avatar(*), badge(*), title(*)")
    .single();

export const searchProfile = (search: string, notin: Array<string>) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*, avatar(*)")
    .ilike("username", `%${search}%`)
    .not("id", "in", `(${notin.join(",")})`)
    .order("username", { ascending: true });

export const searchProfilePagination = (
  search: string,
  notin: Array<string>,
  page: number,
  itemperpage: number
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*, avatar(*)")
    .ilike("username", `%${search}%`)
    .not("id", "in", `(${notin.join(",")})`)
    .order("username", { ascending: true })
    .range(from, to);
};
