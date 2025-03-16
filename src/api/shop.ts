import { ShopThemeInsert, ShopThemeUpdate } from "src/models/Shop";
import { supabase } from "./supabase";

export const SUPABASE_SHOP_VIEW = "viewshop";
export const SUPABASE_THEMESHOP_TABLE = "themeshop";

export const selectShopItemByTheme = (theme: number) =>
  supabase.from(SUPABASE_SHOP_VIEW).select().eq("theme", theme);

/* THEME */
export const selectShopTheme = () =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).select();

export const updateShopTheme = (value: ShopThemeUpdate) =>
  supabase
    .from(SUPABASE_THEMESHOP_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const insertShopTheme = (value: ShopThemeInsert) =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).insert(value).select().single();

export const deleteShopThemeById = (id: number) =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).delete().eq("id", id);
