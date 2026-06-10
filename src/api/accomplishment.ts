import { supabase } from "./supabase";

const SUPABASE_VIEWACCOMPLISHMENT_TABLE = "viewaccomplishment";
const SUPABASE_ACCOMPLISHMENT_TABLE = "accomplishment";
const SUPABASE_STATACCOMPLISHMENT_TABLE = "stataccomplishment";
const SUPABASE_PROFILEACCOMPLISHMENT_TABLE = "profileaccomplishment";

const SUPABASE_GETLEADERBOARDACCOMPLISHMENT_FUNCTION =
  "get_leaderboard_accomplishment";

export const selectStatAccomplishmentPaginate = (
  search: string = "",
  sort: string = "score",
  order = false,
  page = 0,
  itemperpage = 25,
  idFriends?: Array<string>,
  multicompte?: boolean,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDACCOMPLISHMENT_FUNCTION, {
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ascending: order,
    p_sort: sort,
    p_ids_profile: idFriends ?? null,
    p_multicompte: multicompte ?? null,
  });
};

export const selectAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_PROFILEACCOMPLISHMENT_TABLE)
    .select(
      "*, accomplishment(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*))",
    )
    .eq("profile", profile);

export const selectAccomplishment = () =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select(
      "*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), accomplishmenttranslation(*, language(*))",
    )
    .order("id", { ascending: true });

export const selectAccomplishmentById = (id: number) =>
  supabase
    .from(SUPABASE_ACCOMPLISHMENT_TABLE)
    .select(
      "*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), accomplishmenttranslation(*, language(*))",
    )
    .eq("id", id)
    .maybeSingle();

export const selectAccomplishmentByAvatar = (avatar: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select(
      "*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), accomplishmenttranslation(*, language(*))",
    )
    .eq("avatar.id", avatar)
    .not("avatar", "is", null)
    .maybeSingle();

export const selectAccomplishmentByBadge = (id: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select(
      "*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), accomplishmenttranslation(*, language(*))",
    )
    .eq("badge.id", id)
    .not("badge", "is", null)
    .maybeSingle();

export const selectAccomplishmentByTitle = (id: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select(
      "*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), accomplishmenttranslation(*, language(*))",
    )
    .eq("title.id", id)
    .not("title", "is", null)
    .maybeSingle();

export const selectAccomplishmentByBanner = (id: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select(
      "*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), accomplishmenttranslation(*, language(*))",
    )
    .eq("banner.id", id)
    .not("banner", "is", null)
    .maybeSingle();

export const selectStatAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_STATACCOMPLISHMENT_TABLE)
    .select("*,  profile(*, avatar(*))")
    .eq("profile", profile)
    .maybeSingle();

export const unlockAccomplishment = (id: number) =>
  supabase.functions.invoke("unlock-accomplishment-v2", {
    body: JSON.stringify({ id: id }),
  });
