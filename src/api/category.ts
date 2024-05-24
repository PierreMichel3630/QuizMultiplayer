import { CategoryThemeInsert } from "src/models/Category";
import { supabase } from "./supabase";

export const SUPABASE_CATEGORY_TABLE = "category";
export const SUPABASE_CATEGORYTHEME_TABLE = "categorytheme";

export const selectCategories = () =>
  supabase.from(SUPABASE_CATEGORY_TABLE).select();

export const insertCategoryTheme = (value: CategoryThemeInsert) =>
  supabase.from(SUPABASE_CATEGORYTHEME_TABLE).insert(value);
