import { bots } from "./bots";
import { supabase } from "./supabase";

export const SUPABASE_ACCOMPLISHMENT_TABLE = "accomplishment";
export const SUPABASE_STATACCOMPLISHMENT_TABLE = "stataccomplishment";
export const SUPABASE_PROFILEACCOMPLISHMENT_TABLE = "profileaccomplishment";

export const selectAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_PROFILEACCOMPLISHMENT_TABLE)
    .select()
    .eq("profile", profile);

export const selectAccomplishment = () =>
  supabase
    .from(SUPABASE_ACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*), banner(*)")
    .order("id", { ascending: true });

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
    .from(SUPABASE_STATACCOMPLISHMENT_TABLE)
    .select("*, profile(*, avatar(*))")
    .gt(order, 0)
    .not("profile", "in", `(${bots.join(",")})`)
    .order(order, { ascending: false })
    .order("created_at", { ascending: true })
    .range(from, to);
};
