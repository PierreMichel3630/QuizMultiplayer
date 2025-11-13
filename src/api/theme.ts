import {
  ThemeInsert,
  ThemeInsertAdmin,
  ThemeTranslationInsert,
  ThemeTranslationUpdate,
  ThemeUpdate,
} from "src/models/Theme";
import { supabase } from "./supabase";
import { Moment } from "moment";
import { Language } from "src/models/Language";

export const SUPABASE_THEME_TABLE = "theme";
export const SUPABASE_THEME_TRANSLATION_TABLE = "themetranslation";
export const SUPABASE_VUETHEME_TABLE = "viewthemev3";

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

export const selectThemesById = (
  ids: Array<string | number>,
  language?: string
) => {
  let query = supabase.from(SUPABASE_THEME_TABLE).select();
  if (language) {
    query = query.eq("language", language);
  }
  return query.in("id", ids);
};

export const selectThemesByCategory = (
  language: Language,
  id: number | string,
  search = "",
  page = 0,
  itemperpage = 20
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*")
    .eq("category", id)
    .eq("validate", true)
    .eq("enabled", true)
    .ilike(`namelower`, `%${search}%`)
    .eq("language", language.id)
    .range(from, to)
    .order("isfirst", { ascending: false })
    .order(`namelower`, { ascending: true });
};

export const countThemesByCategory = (
  id: number | string,
  language: Language
) =>
  supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("category", id)
    .eq("language", language.id)
    .eq("enabled", true);

export const selectThemeById = (id: number) =>
  supabase
    .from(SUPABASE_THEME_TABLE)
    .select(
      "*, themetranslation!inner(id, name, language(*)), categorytheme(*)"
    )
    .eq("id", id)
    .maybeSingle();

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

export const insertTheme = (value: ThemeInsert) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(value).select().single();

export const insertThemeTranslations = (
  values: Array<ThemeTranslationInsert>
) => supabase.from(SUPABASE_THEME_TRANSLATION_TABLE).insert(values);

export const updateThemeTranslations = (
  values: Array<ThemeTranslationUpdate>
) => supabase.from(SUPABASE_THEME_TRANSLATION_TABLE).upsert(values);

export const insertThemeTranslation = (values: Array<ThemeTranslationInsert>) =>
  supabase.from(SUPABASE_THEME_TRANSLATION_TABLE).insert(values).select();

export const deleteThemeTranslations = (ids: Array<number>) =>
  supabase.from(SUPABASE_THEME_TRANSLATION_TABLE).delete().in("id", ids);

export const selectThemesPropose = (language: Language) =>
  supabase
    .from(SUPABASE_VUETHEME_TABLE)
    .select("*")
    .eq("validate", false)
    .eq("enabled", true)
    .eq("language", language.id)
    .order(`namelower`, { ascending: true });

export const selectThemesProposeAdmin = () =>
  supabase
    .from(SUPABASE_THEME_TABLE)
    .select("*, themetranslation!inner(id, name, language(*))")
    .eq("validate", false)
    .eq("enabled", true);

export const selectThemesProposeBy = (uuid: string) =>
  supabase
    .from(SUPABASE_THEME_TABLE)
    .select("*, themetranslation!inner(id, name, language(*))")
    .eq("proposeby", uuid);

export const countThemes = (language: Language, search: string) => {
  let query = supabase
    .from(SUPABASE_THEME_TABLE)
    .select("id, themetranslation!inner(name, language)", {
      count: "exact",
      head: true,
    });
  if (search !== "") {
    query = query
      .eq("themetranslation.language", language.id)
      .not("themetranslation.language", "is", null)
      .ilike("themetranslation.name", `%${search}%`);
  }

  return query;
};

export const searchThemes = (
  language: Language,
  search: string,
  page = 0,
  itemperpage = 20
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_THEME_TABLE)
    .select("*, themetranslation!inner(id, name, language(*))");

  if (search !== "") {
    query = query
      .eq("themetranslation.language", language.id)
      .not("themetranslation.language", "is", null)
      .ilike("themetranslation.name", `%${search}%`);
  }

  return query.range(from, to).order("id");
};
