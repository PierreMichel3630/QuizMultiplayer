import { BannerInsert, BannerUpdate } from "src/models/Banner";
import { supabase } from "./supabase";

export const SUPABASE_BANNERPROFILE_TABLE = "bannerprofile";
export const SUPABASE_BANNER_TABLE = "banner";

export const selectBanners = () =>
  supabase
    .from(SUPABASE_BANNER_TABLE)
    .select("*, theme(*)")
    .order("id", { ascending: false });

export const selectBannerByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_BANNERPROFILE_TABLE)
    .select("*, banner(*)")
    .eq("profile", profile);

export const selectBannerById = (id: number) =>
  supabase.from(SUPABASE_BANNER_TABLE).select("*").eq("id", id).maybeSingle();

export const insertBanner = (value: BannerInsert) =>
  supabase.from(SUPABASE_BANNER_TABLE).insert(value).select().single();

export const updateBanner = (value: BannerUpdate) =>
  supabase
    .from(SUPABASE_BANNER_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();
