import { ProfileUpdate } from "src/models/Profile";
import { supabase } from "./supabase";

export const SUPABASE_PROFILE_TABLE = "profiles";

export const getProfilById = (uuid: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*, avatar(*), badge(*), title(*), banner(*), country(*)")
    .eq("id", uuid)
    .single();

export const updateProfil = (profil: ProfileUpdate) =>
  supabase.from(SUPABASE_PROFILE_TABLE).update(profil).eq("id", profil.id);

export const updateSelectProfil = (profil: ProfileUpdate) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .update(profil)
    .eq("id", profil.id)
    .select("*, avatar(*), badge(*), title(*), banner(*), country(*)")
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
    .order("lower_name", { ascending: true })
    .range(from, to);
};

export const countProfile = () =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true });

export const countPlayers = () =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true });

export const countPlayersSameUsername = (username: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("username", username);
