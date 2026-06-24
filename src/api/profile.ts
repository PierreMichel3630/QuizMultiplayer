import { ProfileUpdate } from "src/models/Profile";
import { supabase } from "./supabase";
import moment from "moment";
import { VERSION_APP } from "src/utils/config";
import { bots } from "./bots";

const SUPABASE_PROFILE_TABLE = "profiles";
const SUPABASE_PROFILEACCOUNT_TABLE = "profileaccount";

const SUPABASE_UPDATEPROFIL_FUNCTION = "update-profil";
const SUPABASE_GETLEADERBOARDPROFILE_FUNCTION = "get_leaderboard_profile";

const selectQueryProfile =
  "*, avatar(*), badge(*), banner(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))";

export const selectProfilById = (uuid: string) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select(selectQueryProfile)
    .eq("id", uuid)
    .single();

export const updateProfil = (profil: ProfileUpdate) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .update(profil)
    .eq("id", profil.id)
    .select(selectQueryProfile)
    .maybeSingle();

export const updateSelectProfil = (profil: ProfileUpdate) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .update(profil)
    .eq("id", profil.id)
    .select(selectQueryProfile)
    .single();

export const searchProfilePagination = (
  search: string,
  notin: Array<string>,
  page: number,
  itemperpage: number,
  multicompte?: boolean,
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select(
      "*, avatar(*), badge(*),country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))",
    )
    .ilike("username", `%${search}%`)
    .not("id", "in", `(${notin.join(",")})`);

  if (multicompte !== undefined) {
    query = query.eq("multicompte", multicompte);
  }

  return query.order("lower_name", { ascending: true }).range(from, to);
};

export const countProfile = (search = "", notin: Array<string> = []) =>
  supabase
    .from(SUPABASE_PROFILE_TABLE)
    .select("*", { count: "exact", head: true })
    .ilike("username", `%${search}%`)
    .not("id", "in", `(${notin.join(",")})`);

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

// Profile ACCOUNT

export const selectProfileAccountByProfile = (uuid: string) => {
  return supabase
    .from(SUPABASE_PROFILEACCOUNT_TABLE)
    .select(
      "*, profileconnect(*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))",
    )
    .eq("profile", uuid);
};
