import { ProfileUpdate } from "src/models/Profile";
import { supabase } from "./supabase";
import moment from "moment";
import { VERSION_APP } from "src/utils/config";
import { bots } from "./bots";

const SUPABASE_PROFILE_TABLE = "profiles";

const SUPABASE_UPDATEPROFIL_FUNCTION = "update-profil";
const SUPABASE_GETLEADERBOARDPROFILE_FUNCTION = "get_leaderboard_profile";

export const getProfilById = (uuid: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select(
      "*, avatar(*), badge(*), banner(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))",
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
      "*, avatar(*), badge(*), banner(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))",
    )
    .single();

export const searchProfilePagination = (
  search: string,
  notin: Array<string>,
  page: number,
  itemperpage: number,
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select(
      "*, avatar(*), badge(*),country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))",
    )
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
    .ilike("username", username);

export const updateProfilByFunction = (accounts?: Array<string>) =>
  supabase.functions.invoke(SUPABASE_UPDATEPROFIL_FUNCTION, {
    body: {
      date: moment(),
      version: VERSION_APP,
      accounts,
    },
  });

export const selectProfile = (
  order: { value: string; ascending: boolean },
  page: number,
  itemperpage = 25,
  idsProfile = [] as Array<string>,
  search = "",
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select(
      "*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))",
    )
    .gt(order.value, 0)
    .ilike("username", `%${search}%`)
    .not("id", "in", `(${bots.join(",")})`);
  if (idsProfile.length > 0) {
    query = query.in("id", idsProfile);
  }
  return query
    .order(order.value, { ascending: order.ascending })
    .order("created_at", { ascending: true })
    .range(from, to);
};

export const selectProfilePaginate = (
  search: string = "",
  page = 0,
  itemperpage = 25,
  sort = "money",
  ascending = true,
  idFriends?: Array<string>,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDPROFILE_FUNCTION, {
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ids_profile: idFriends ?? null,
    p_ascending: ascending,
    p_sort: sort,
  });
};
