import { ThemeInsert, ThemeInsertAdmin, ThemeUpdate } from "src/models/Theme";
import { supabase } from "./supabase";

export const SUPABASE_THEME_TABLE = "theme";
export const SUPABASE_THEMESHOP_TABLE = "themeshop";
export const SUPABASE_VUETHEME_TABLE = "viewthemev2";

export const selectThemes = () =>
  supabase.from(SUPABASE_VUETHEME_TABLE).select("*, category(*)");

export const countThemes = () =>
  supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("enabled", true);

export const selectThemeById = (id: number) =>
  supabase.from(SUPABASE_THEME_TABLE).select().eq("id", id).maybeSingle();

export const updateTheme = (value: ThemeUpdate) =>
  supabase
    .from(SUPABASE_THEME_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const insertThemeAdmin = (value: ThemeInsertAdmin) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(value).select().single();

export const selectThemesShop = () =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).select("*");

export const insertTheme = (value: ThemeInsert) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(value).select().single();

export const selectThemesPropose = () =>
  supabase.from(SUPABASE_THEME_TABLE).select("*").eq("validate", false);
