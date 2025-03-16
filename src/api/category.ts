import {
  CategoryInsert,
  CategoryThemeInsert,
  CategoryUpdate,
} from "src/models/Category";
import { supabase } from "./supabase";

export const SUPABASE_CATEGORY_TABLE = "category";
export const SUPABASE_CATEGORYTHEME_TABLE = "categorytheme";

export const selectCategories = () =>
  supabase.from(SUPABASE_CATEGORY_TABLE).select();

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
