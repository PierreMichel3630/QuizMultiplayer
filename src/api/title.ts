import {
  TitleInsert,
  TitleTranslationInsert,
  TitleTranslationUpdate,
  TitleUpdate,
} from "src/models/Title";
import { supabase } from "./supabase";

export const SUPABASE_TITLEPROFILE_TABLE = "titleprofile";

export const SUPABASE_TITLE_TABLE = "title";
export const SUPABASE_TITLE_TRANSLATION_TABLE = "titletranslation";

export const selectTitles = () =>
  supabase
    .from(SUPABASE_TITLE_TABLE)
    .select("*, theme(*), titletranslation(*, language(*))")
    .order("id", { ascending: false });

export const countTitles = () => {
  return supabase
    .from(SUPABASE_TITLE_TABLE)
    .select("id, theme(*), titletranslation(*, language(*))", {
      count: "exact",
      head: true,
    });
};

export const searchTitles = (page = 0, itemperpage = 20) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  const query = supabase
    .from(SUPABASE_TITLE_TABLE)
    .select("*, titletranslation(*, language(*))");

  return query.range(from, to).order("id");
};

export const selectTitleByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_TITLEPROFILE_TABLE)
    .select("*, title(*, titletranslation(*, language(*)))")
    .eq("profile", profile);

export const selectTitleById = (id: number) =>
  supabase
    .from(SUPABASE_TITLE_TABLE)
    .select("*, titletranslation(*, language(*))")
    .eq("id", id)
    .maybeSingle();

export const insertTitle = (value: TitleInsert) =>
  supabase.from(SUPABASE_TITLE_TABLE).insert(value).select().single();

export const updateTitle = (value: TitleUpdate) =>
  supabase
    .from(SUPABASE_TITLE_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const insertTitleTranslations = (
  values: Array<TitleTranslationInsert>
) => supabase.from(SUPABASE_TITLE_TRANSLATION_TABLE).insert(values);

export const updateTitleTranslations = (
  values: Array<TitleTranslationUpdate>
) => supabase.from(SUPABASE_TITLE_TRANSLATION_TABLE).upsert(values);

export const deleteTitleTranslations = (ids: Array<number>) =>
  supabase.from(SUPABASE_TITLE_TRANSLATION_TABLE).delete().in("id", ids);
