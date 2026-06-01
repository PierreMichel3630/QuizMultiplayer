import { Language } from "src/models/Language";
import { ListAnswerPlay, OrderListScore } from "src/models/List";
import { removeAccentsAndLowercase } from "src/utils/string";
import { supabase } from "./supabase";

const SUPABASE_LIST_TABLE = "list";
const SUPABASE_LISTTRANSLATION_TABLE = "listtranslation";
const SUPABASE_LISTANSWER_TABLE = "listanswer";
const SUPABASE_LISTSCORE_TABLE = "listscore";
const SUPABASE_SAVESCORELIST_FUNCTION = "savescorelist";

const SUPABASE_LISTSCORERANKING_VIEW = "viewlistscoreranking";

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
    .eq("list.enabled", true)
    .eq("language", language.id)
    .not("list", "is", null)
    .range(from, to)
    .order(`namelower`, { ascending: true });
};

export const selectListAnswerByListId = (id: number | string) =>
  supabase
    .from(SUPABASE_LISTANSWER_TABLE)
    .select("*, listanswertranslation(*, language(*))")
    .eq("list", id);

export const selectListScoreByListIdAndProfile = (
  id: number | string,
  profile: string,
) =>
  supabase
    .from(SUPABASE_LISTSCORE_TABLE)
    .select("*, list(*)")
    .eq("list", id)
    .eq("profile", profile)
    .maybeSingle();

export const saveScoreList = (
  answers: Array<ListAnswerPlay>,
  time: number,
  attempts: number,
  list: number,
) =>
  supabase.functions.invoke(SUPABASE_SAVESCORELIST_FUNCTION, {
    body: { answers, time, attempts, list },
  });

export const countListScore = (
  list: number,
  idsProfile: undefined | Array<string> = undefined,
  search = "",
) => {
  let query = supabase
    .from(SUPABASE_LISTSCORE_TABLE)
    .select("*, profile(username)", {
      count: "exact",
      head: true,
    })
    .eq("list", list)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const selectListScorePaginate = (
  list: number,
  search = "",
  page = 0,
  itemperpage = 5,
  sort = OrderListScore.ATTEMPT,
  idsProfile: undefined | Array<string> = undefined,
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_LISTSCORERANKING_VIEW)
    .select(
      `
    *, profile(*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))
  `,
    )
    .eq("list", list)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);
  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query.range(from, to).order(sort, { ascending: true });
};

export const selectListScoreByProfile = (profile: string) =>
  supabase
    .from(SUPABASE_LISTSCORE_TABLE)
    .select("*, list(*)")
    .eq("profile", profile);
