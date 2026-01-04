import {
  ThemeShopInsert,
  ThemeShopTranslationInsert,
  ThemeShopTranslationUpdate,
  ThemeShopUpdate,
} from "src/models/Shop";
import { supabase } from "./supabase";

export const SUPABASE_SHOP_VIEW = "viewshop";
export const SUPABASE_THEMESHOP_TABLE = "themeshop";
export const SUPABASE_THEMESHOP_TRANSLATION_TABLE = "themeshoptranslation";

export const selectShopItemByTheme = (theme: number) =>
  supabase.from(SUPABASE_SHOP_VIEW).select("*").eq("theme", theme);

/* THEME */
export const selectThemeShop = () =>
  supabase
    .from(SUPABASE_THEMESHOP_TABLE)
    .select("*, themeshoptranslation(*, language(*))")
    .order("id");

export const updateThemeShop = (value: ThemeShopUpdate) =>
  supabase
    .from(SUPABASE_THEMESHOP_TABLE)
    .update(value)
    .eq("id", value.id)
    .select("*")
    .single();

export const insertThemeShop = (value: ThemeShopInsert) =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).insert(value).select("*").single();

export const deleteThemeShopById = (id: number) =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).delete().eq("id", id);

export const insertThemeShopTranslations = (
  values: Array<ThemeShopTranslationInsert>
) => supabase.from(SUPABASE_THEMESHOP_TRANSLATION_TABLE).insert(values);

export const updateThemeShopTranslations = (
  values: Array<ThemeShopTranslationUpdate>
) => supabase.from(SUPABASE_THEMESHOP_TRANSLATION_TABLE).upsert(values);

export const deleteThemeShopTranslations = (ids: Array<number>) =>
  supabase.from(SUPABASE_THEMESHOP_TRANSLATION_TABLE).delete().in("id", ids);
