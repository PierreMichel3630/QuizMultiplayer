import { supabase } from "./supabase";

export const SUPABASE_BANNERPROFILE_TABLE = "bannerprofile";
export const SUPABASE_BANNER_TABLE = "banner";

export const selectBanners = () =>
  supabase.from(SUPABASE_BANNER_TABLE).select();

export const selectBannerByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_BANNERPROFILE_TABLE)
    .select("*, banner(*)")
    .eq("profile", profile);

export const selectBannerById = (id: number) =>
  supabase.from(SUPABASE_BANNER_TABLE).select("*").eq("id", id).maybeSingle();
