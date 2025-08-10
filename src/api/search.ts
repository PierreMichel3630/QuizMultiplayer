import moment, { Moment } from "moment";
import { supabase } from "./supabase";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import { removeAccentsAndLowercase } from "src/utils/string";
import { Language } from "src/models/Language";

export const SUPABASE_VIEWSEARCH_TABLE = "viewsearchv2";

export const searchThemesAndCategoriesPaginate = (
  language: Language,
  search = "",
  page = 0,
  itemperpage = 20
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  const searchLower = removeAccentsAndLowercase(search);

  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .ilike(`namelower`, `%${searchLower}%`)
    .eq("language", language.id)
    .range(from, to)
    .order(`namelower`, { ascending: true });
};

export const searchThemesPaginate = (
  language: Language,
  search = "",
  page = 0,
  itemperpage = 20
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  const searchLower = removeAccentsAndLowercase(search);

  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .ilike(`namelower`, `%${searchLower}%`)
    .eq("type", "THEME")
    .eq("language", language.id)
    .range(from, to)
    .order(`namelower`, { ascending: true });
};

export const searchCategoriesPaginate = (
  language: Language,
  search = "",
  page = 0,
  itemperpage = 20
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  const searchLower = removeAccentsAndLowercase(search);

  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .ilike(`namelower`, `%${searchLower}%`)
    .eq("type", "CATEGORY")
    .eq("language", language.id)
    .range(from, to)
    .order(`namelower`, { ascending: true });
};

export const getThemesAndCategoriesById = (
  language: Language,
  idsCategory: Array<string | number>,
  idsTheme: Array<string | number>
) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .or(
      `and(type.eq.CATEGORY,id.in.(${idsCategory.join()})),and(type.eq.THEME,id.in.(${idsTheme.join()}))`
    )
    .eq("language", language.id)
    .order(`namelower`, { ascending: true });
};

export const getThemesById = (
  idsTheme: Array<string | number>,
  language = "fr-FR"
) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .or(`idtheme.in.(${idsTheme.join()})`)
    .order(`name->>${language}`, { ascending: true });
};

export const getThemesAndCategoriesByDate = (
  language: Language,
  day = MAX_DAY_NEW_THEME
) => {
  const date = moment().subtract(day, "day").format("YYYY-MM-DD");
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .eq("language", language.id)
    .gte("created_at", date)
    .order(`created_at`, { ascending: false });
};

export const getThemesByModifiedAt = (language: Language, modify_at: Moment) =>
  supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .eq("type", "THEME")
    .eq("language", language.id)
    .gte("modify_at", modify_at.toISOString())
    .order("modify_at", { ascending: false });

export const getCategories = (language: Language) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .eq("type", "CATEGORY")
    .eq("language", language.id)
    .order(`namelower`, { ascending: true });
};
