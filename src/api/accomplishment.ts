import { supabase } from "./supabase";

export const SUPABASE_ACCOMPLISHMENT_TABLE = "accomplishment";
export const SUPABASE_STATACCOMPLISHMENT_TABLE = "stataccomplishment";
export const SUPABASE_PROFILEACCOMPLISHMENT_TABLE = "profileaccomplishment";

export const selectMyAccomplishment = (profile: string) =>
  supabase
    .from(SUPABASE_PROFILEACCOMPLISHMENT_TABLE)
    .select()
    .eq("profile", profile);

export const selectAccomplishment = () =>
  supabase
    .from(SUPABASE_ACCOMPLISHMENT_TABLE)
    .select("*, title(*), avatar(*), badge(*)")
    .order("id", { ascending: true });

export const selectStatAccomplishmentByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_STATACCOMPLISHMENT_TABLE)
    .select("*,  profile(*, avatar(*))")
    .eq("profile", profile)
    .maybeSingle();

export const selectStatAccomplishment = (order: string) =>
  supabase
    .from(SUPABASE_STATACCOMPLISHMENT_TABLE)
    .select("*, profile(*, avatar(*))")
    .order(order, { ascending: false })
    .order("created_at", { ascending: true })
    .limit(25);
