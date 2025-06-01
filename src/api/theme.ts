import { ThemeInsert, ThemeInsertAdmin, ThemeUpdate } from "src/models/Theme";
import { supabase } from "./supabase";
import { Moment } from "moment";

export const SUPABASE_THEME_TABLE = "theme";
export const SUPABASE_THEMESHOP_TABLE = "themeshop";
export const SUPABASE_VUETHEME_TABLE = "viewthemev2";

export const selectThemes = () =>
  supabase.from(SUPABASE_VUETHEME_TABLE).select("*, category(*)");

export const selectThemesByModifiedAt = (modify_at: Moment) =>
  supabase
    .from(SUPABASE_THEME_TABLE)
    .select("*")
    .eq("validate", true)
    .eq("enabled", true)
    .gte("modify_at", modify_at.toISOString())
    .order("modify_at", { ascending: false });

export const selectThemesByCreatedAt = (created_at: Moment) =>
  supabase
    .from(SUPABASE_THEME_TABLE)
    .select("*")
    .eq("validate", true)
    .eq("enabled", true)
    .gte("created_at", created_at.toISOString())
    .order("created_at", { ascending: false });

export const selectThemesById = (ids: Array<string | number>) =>
  supabase.from(SUPABASE_THEME_TABLE).select().in("id", ids);

export const selectThemesByCategory = (
  id: number | string,
  search = "",
  page = 0,
  itemperpage = 20,
  language = "fr-FR"
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*")
    .eq("category", id)
    .eq("validate", true)
    .eq("enabled", true)
    .ilike(`titlelower`, `%${search}%`)
    .eq("language", language)
    .range(from, to)
    .order("isfirst", { ascending: false })
    .order(`titlelower`, { ascending: true });
};

export const searchThemes = (
  search = "",
  page = 0,
  itemperpage = 20,
  language = "fr-FR"
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_THEME_TABLE)
    .select()
    .ilike(`name->>${language}`, `%${search}%`)
    .range(from, to)
    .order(`name->>${language}`, { ascending: true });
};

export const countThemes = () =>
  supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("enabled", true);

export const countThemesByCategory = (id: number | string) =>
  supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("category", id)
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

export const deleteThemeById = (id: number) =>
  supabase.from(SUPABASE_THEME_TABLE).delete().eq("id", id);

export const insertThemeAdmin = (value: ThemeInsertAdmin) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(value).select().single();

export const selectThemesShop = () =>
  supabase.from(SUPABASE_THEMESHOP_TABLE).select("*");

export const insertTheme = (value: ThemeInsert) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(value).select().single();

export const selectThemesPropose = () =>
  supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*, category(*)")
    .eq("validate", false);
