import { bots } from "./bots";
import { supabase } from "./supabase";

export const SUPABASE_VIEWACCOMPLISHMENT_TABLE = "viewaccomplishment";
export const SUPABASE_ACCOMPLISHMENT_TABLE = "accomplishment";
export const SUPABASE_STATACCOMPLISHMENT_TABLE = "stataccomplishment";
export const SUPABASE_VIEWSTATACCOMPLISHMENT_TABLE = "viewstataccomplishment";
export const SUPABASE_PROFILEACCOMPLISHMENT_TABLE = "profileaccomplishment";

export const selectAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_PROFILEACCOMPLISHMENT_TABLE)
    .select("*, accomplishment(*, title(*), avatar(*), badge(*), banner(*))")
    .eq("profile", profile);

export const selectUnlockAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_PROFILEACCOMPLISHMENT_TABLE)
    .select("*, accomplishment(*, title(*), avatar(*), badge(*), banner(*))")
    .eq("profile", profile)
    .eq("validate", false);

export const selectAccomplishment = () =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*), banner(*)")
    .order("id", { ascending: true });

export const selectAccomplishmentByAvatar = (avatar: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*), banner(*)")
    .eq("avatar.id", avatar)
    .not("avatar", "is", null)
    .maybeSingle();

export const selectAccomplishmentByBadge = (id: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*), banner(*)")
    .eq("badge.id", id)
    .not("badge", "is", null)
    .maybeSingle();

export const selectAccomplishmentByTitle = (id: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*), banner(*)")
    .eq("title.id", id)
    .not("title", "is", null)
    .maybeSingle();

export const selectAccomplishmentByBanner = (id: number) =>
  supabase
    .from(SUPABASE_VIEWACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*), banner(*)")
    .eq("banner.id", id)
    .not("banner", "is", null)
    .maybeSingle();

export const selectStatAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_STATACCOMPLISHMENT_TABLE)
    .select("*,  profile(*, avatar(*))")
    .eq("profile", profile)
    .maybeSingle();

export const selectStatAccomplishment = (
  order: string,
  page: number,
  itemperpage = 25,
  idsProfile = [] as Array<string>,
  search = ""
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_VIEWSTATACCOMPLISHMENT_TABLE)
    .select(
      "*, profile(*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*)))"
    )
    .gt(order, 0)
    .ilike("profile.username", `%${search}%`)
    .not("profile.id", "in", `(${bots.join(",")})`)
    .not("profile", "is", null);
  if (idsProfile.length > 0) {
    query = query.in("profile.id", idsProfile).not("profile", "is", null);
  }
  return query
    .order(order, { ascending: false })
    .order("created_at", { ascending: true })
    .range(from, to);
};

export const countStatAccomplishment = (
  order: string,
  search = "",
  idsProfile: undefined | Array<string> = undefined
) => {
  let query = supabase
    .from(SUPABASE_VIEWSTATACCOMPLISHMENT_TABLE)
    .select("*, profile(*)", { count: "exact", head: true })
    .gt(order, 0)
    .ilike("profile.username", `%${search}%`)
    .not("profile.id", "in", `(${bots.join(",")})`)
    .not("profile", "is", null);
  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const unlockAccomplishment = (id: number) =>
  supabase.functions.invoke("unlock-accomplishment-v2", {
    body: JSON.stringify({ id: id }),
  });
