import { ProfileUpdate } from "src/models/Profile";
import { supabase } from "./supabase";
import moment from "moment";

export const SUPABASE_PROFILE_TABLE = "profiles";
export const SUPABASE_UPDATEPROFIL_FUNCTION = "update-profil";

export const getProfilById = (uuid: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select(
      "*, avatar(*), badge(*), banner(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*))"
    )
    .eq("id", uuid)
    .single();

export const updateProfil = (profil: ProfileUpdate) =>
  supabase.from(SUPABASE_PROFILE_TABLE).update(profil).eq("id", profil.id);

export const updateSelectProfil = (profil: ProfileUpdate) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .update(profil)
    .eq("id", profil.id)
    .select(
      "*, avatar(*), badge(*), banner(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*))"
    )
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

export const countProfile = (search = "") =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true })
    .ilike("username", `%${search}%`);

export const countPlayers = () =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true });

export const countPlayersSameUsername = (username: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("username", username);

export const updateProfilByFunction = () =>
  supabase.functions.invoke(SUPABASE_UPDATEPROFIL_FUNCTION, {
    body: {
      date: moment(),
    },
  });
