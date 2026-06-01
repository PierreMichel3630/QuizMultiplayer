import moment from "moment";
import { Language } from "src/models/Language";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import { removeAccentsAndLowercase } from "src/utils/string";
import { supabase } from "./supabase";

const SUPABASE_VIEWSEARCH_TABLE = "viewsearchv2";
const SUPABASE_GETITEMS_FUNCTION = "get_category_items";
const SUPABASE_SEARCH_FUNCTION = "search";

export const searchThemesAndCategoriesPaginate = (
  language: Language,
  search = "",
  page = 0,
  itemperpage = 20,
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
  itemperpage = 20,
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
  itemperpage = 20,
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

export const getCategoryById = (id: number, language: Language) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .eq("type", "CATEGORY")
    .eq("id", id)
    .eq("language", language.id)
    .maybeSingle();
};

export const getThemesAndCategoriesById = (
  language: Language,
  idsCategory: Array<string | number>,
  idsTheme: Array<string | number>,
) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .or(
      `and(type.eq.CATEGORY,id.in.(${idsCategory.join()})),and(type.eq.THEME,id.in.(${idsTheme.join()}))`,
    )
    .eq("language", language.id)
    .order(`namelower`, { ascending: true });
};

export const getThemesById = (
  idsTheme: Array<string | number>,
  language: Language,
) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .eq("language", language.id)
    .or(`id.in.(${idsTheme.join()})`)
    .order(`namelower`, { ascending: true });
};

export const getThemesAndCategoriesByDate = (
  language: Language,
  day = MAX_DAY_NEW_THEME,
) => {
  const date = moment().subtract(day, "day").format("YYYY-MM-DD");
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .eq("language", language.id)
    .gte("created_at", date)
    .order(`created_at`, { ascending: false });
};

export const selectItemsByCategory = (
  language: Language,
  id: number | string,
  search = "",
  page = 0,
  itemperpage = 25,
) => {
  const offset = page * itemperpage;

  return supabase.rpc(SUPABASE_GETITEMS_FUNCTION, {
    p_category: id,
    p_language: language.id,
    p_search: search,
    p_limit: itemperpage,
    p_offset: offset,
  });
};

export const search = (
  language: Language,
  search = "",
  page = 0,
  itemperpage = 25,
  type?: SearchType,
) => {
  const offset = page * itemperpage;

  return supabase.rpc(SUPABASE_SEARCH_FUNCTION, {
    p_type: type ?? null,
    p_language: language.id,
    p_search: search,
    p_limit: itemperpage,
    p_offset: offset,
  });
};
