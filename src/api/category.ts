import {
  CategoryInsert,
  CategoryThemeInsert,
  CategoryUpdate,
} from "src/models/Category";
import { supabase } from "./supabase";

export const SUPABASE_CATEGORY_TABLE = "category";
export const SUPABASE_CATEGORYTHEME_TABLE = "categorytheme";

export const selectCategories = (language = "fr-FR") =>
  supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select()
    .order(`name->>${language}`, { ascending: true });

export const selectCategoriesById = (ids: Array<string | number>) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).select().in("id", ids);

export const selectCategoryById = (id: string | number) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).select().eq("id", id).maybeSingle();

export const searchCategories = (
  search = "",
  page = 0,
  itemperpage = 20,
  language = "fr-FR"
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select("id, name")
    .ilike(`name->>${language}`, `%${search}%`)
    .range(from, to)
    .order(`name->>${language}`, { ascending: true });
};

export const insertCategoryTheme = (value: CategoryThemeInsert) =>
  supabase.from(SUPABASE_CATEGORYTHEME_TABLE).insert(value);

export const updateCategory = (value: CategoryUpdate) =>
  supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const insertCategory = (value: CategoryInsert) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).insert(value).select().single();

export const deleteCategoryById = (id: number) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).delete().eq("id", id);

export const countCategory = () =>
  supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select("id", { count: "exact", head: true });
