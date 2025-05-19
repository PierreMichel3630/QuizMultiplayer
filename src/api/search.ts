import moment from "moment";
import { supabase } from "./supabase";
import { MAX_DAY_NEW_THEME } from "src/utils/config";

export const SUPABASE_VIEWSEARCH_TABLE = "viewsearch";

export const searchThemesAndCategories = (
  search = "",
  page = 0,
  itemperpage = 20,
  language = "fr-FR"
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .ilike(`name->>${language}`, `%${search}%`)
    .range(from, to)
    .order(`name->>${language}`, { ascending: true });
};

export const searchCategories = (
  search = "",
  page = 0,
  itemperpage = 20,
  language = "fr-FR"
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .ilike(`name->>${language}`, `%${search}%`)
    .eq("type", "CATEGORY")
    .range(from, to)
    .order(`name->>${language}`, { ascending: true });
};

export const getThemesAndCategoriesById = (
  idsCategory: Array<string | number>,
  idsTheme: Array<string | number>,
  language = "fr-FR"
) => {
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .or(`idcategory.in.(${idsCategory.join()}),idtheme.in.(${idsTheme.join()})`)
    .order(`name->>${language}`, { ascending: true });
};

export const getThemesAndCategoriesByDate = (day = MAX_DAY_NEW_THEME) => {
  const date = moment().subtract(day, "day").format("YYYY-MM-DD");
  return supabase
    .from(SUPABASE_VIEWSEARCH_TABLE)
    .select("*")
    .gte("created_at", date)
    .order(`created_at`, { ascending: false });
};
