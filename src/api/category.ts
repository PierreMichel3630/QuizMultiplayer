import {
  CategoryInsert,
  CategoryThemeInsert,
  CategoryTranslationInsert,
  CategoryTranslationUpdate,
  CategoryUpdate,
} from "src/models/Category";
import { supabase } from "./supabase";
import { Language } from "src/models/Language";

export const SUPABASE_CATEGORY_TABLE = "category";
export const SUPABASE_CATEGORYTRANSLATION_TABLE = "categorytranslation";
export const SUPABASE_CATEGORYTHEME_TABLE = "categorytheme";

export const selectCategoryById = (id: string | number) =>
  supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select("*, categorytranslation!inner(id, name, language(*))")
    .eq("id", id)
    .maybeSingle();

export const insertCategoryTheme = (values: Array<CategoryThemeInsert>) =>
  supabase.from(SUPABASE_CATEGORYTHEME_TABLE).insert(values);

export const updateCategories = (values: Array<CategoryUpdate>) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).upsert(values);

export const insertCategory = (value: CategoryInsert) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).insert(value).select().single();

export const insertCategoryTranslation = (value: CategoryTranslationInsert) =>
  supabase
    .from(SUPABASE_CATEGORYTRANSLATION_TABLE)
    .insert(value)
    .select()
    .single();

export const updateCategoryTranslation = (value: CategoryTranslationUpdate) =>
  supabase
    .from(SUPABASE_CATEGORYTRANSLATION_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const deleteCategoryTranslationById = (ids: Array<number>) =>
  supabase.from(SUPABASE_CATEGORYTRANSLATION_TABLE).delete().in("id", ids);

export const deleteCategoryById = (id: number) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).delete().eq("id", id);

export const deleteCategoryByIds = (ids: Array<number>) =>
  supabase.from(SUPABASE_CATEGORY_TABLE).delete().in("id", ids);

export const countCategoryByLanguage = (language: Language) =>
  supabase
    .from(SUPABASE_CATEGORYTRANSLATION_TABLE)
    .select("id", { count: "exact", head: true })
    .eq("language", language.id);

export const searchCategories = (
  language: Language,
  search: string,
  page = 0,
  itemperpage = 20
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select("id, categorytranslation!inner(id, name, language(*))");

  if (search !== "") {
    query = query
      .eq("categorytranslation.language", language.id)
      .not("categorytranslation.language", "is", null)
      .ilike("categorytranslation.name", `%${search}%`);
  }

  return query.range(from, to).order("id");
};

export const countCategory = (language: Language, search: string) => {
  let query = supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select("id, categorytranslation!inner(name, language)", {
      count: "exact",
      head: true,
    });
  if (search !== "") {
    query = query
      .eq("categorytranslation.language", language.id)
      .not("categorytranslation.language", "is", null)
      .ilike("categorytranslation.name", `%${search}%`);
  }

  return query;
};
