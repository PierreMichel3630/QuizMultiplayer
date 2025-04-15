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
  itemperpage = 25
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_VIEWSTATACCOMPLISHMENT_TABLE)
    .select("*, profile(*, avatar(*), country(*))")
    .gt(order, 0)
    .not("profile", "in", `(${bots.join(",")})`)
    .order(order, { ascending: false })
    .order("created_at", { ascending: true })
    .range(from, to);
};

export const unlockAccomplishment = (id: number) =>
  supabase.functions.invoke("unlock-accomplishment", {
    body: JSON.stringify({ id: id }),
  });
