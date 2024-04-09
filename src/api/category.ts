import { supabase } from "./supabase";

export const SUPABASE_CATEGORY_TABLE = "category";

export const selectCategories = () =>
  supabase.from(SUPABASE_CATEGORY_TABLE).select();
