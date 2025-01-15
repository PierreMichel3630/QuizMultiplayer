import { supabase } from "./supabase";

export const SUPABASE_SHOP_VIEW = "viewshop";

export const selectShopItemByTheme = (theme: number) =>
  supabase.from(SUPABASE_SHOP_VIEW).select().eq("theme", theme);
