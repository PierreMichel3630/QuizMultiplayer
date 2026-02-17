import { Language } from "src/models/Language";
import { removeAccentsAndLowercase } from "src/utils/string";
import { supabase } from "./supabase";

export const SUPABASE_LIST_TABLE = "list";
export const SUPABASE_LISTTRANSLATION_TABLE = "listtranslation";
export const SUPABASE_LISTANSWER_TABLE = "listanswer";

export const selectListById = (id: number | string) =>
  supabase
    .from(SUPABASE_LIST_TABLE)
    .select("*, listtranslation(*)")
    .eq("id", id)
    .maybeSingle();

export const searchListPaginate = (
  language: Language,
  search = "",
  page = 0,
  itemperpage = 20,
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  const searchLower = removeAccentsAndLowercase(search);

  return supabase
    .from(SUPABASE_LISTTRANSLATION_TABLE)
    .select("*, list(*)")
    .ilike(`namelower`, `%${searchLower}%`)
    .eq("language", language.id)
    .range(from, to)
    .order(`namelower`, { ascending: true });
};

export const countList = (language: Language, search = "") =>
  supabase
    .from(SUPABASE_LISTTRANSLATION_TABLE)
    .select("*", { count: "exact", head: true })
    .ilike(`namelower`, `%${search}%`)
    .eq("language", language.id);

export const selectListAnswerByListId = (id: number | string) =>
  supabase
    .from(SUPABASE_LISTANSWER_TABLE)
    .select("*, listanswertranslation(*)")
    .eq("list", id);
