import moment from "moment";
import { Language } from "src/models/Language";
import { ListAnswerPlay, OrderListScore } from "src/models/List";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import { removeAccentsAndLowercase } from "src/utils/string";
import { supabase } from "./supabase";

export const SUPABASE_LIST_TABLE = "list";
export const SUPABASE_LISTTRANSLATION_TABLE = "listtranslation";
export const SUPABASE_LISTANSWER_TABLE = "listanswer";
export const SUPABASE_LISTSCORE_TABLE = "listscore";
export const SUPABASE_SAVESCORELIST_FUNCTION = "savescorelist";

export const SUPABASE_LISTSCORERANKING_VIEW = "viewlistscoreranking";

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

export const countList = (language: Language, search = "") =>
  supabase
    .from(SUPABASE_LISTTRANSLATION_TABLE)
    .select("*", { count: "exact", head: true })
    .ilike(`namelower`, `%${search}%`)
    .eq("language", language.id);

export const selectListAnswerByListId = (id: number | string) =>
  supabase
    .from(SUPABASE_LISTANSWER_TABLE)
    .select("*, listanswertranslation(*, language(*))")
    .eq("list", id);

export const selectListScoreByListId = (id: number | string) =>
  supabase
    .from(SUPABASE_LISTSCORE_TABLE)
    .select(
      "*, profile(*, avatar(*), country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))",
    )
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

export const getListByDate = (language: Language, day = MAX_DAY_NEW_THEME) => {
  const date = moment().subtract(day, "day").format("YYYY-MM-DD");
  return supabase
    .from(SUPABASE_LISTTRANSLATION_TABLE)
    .select("*")
    .eq("language", language.id)
    .gte("created_at", date)
    .order(`created_at`, { ascending: false });
};

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



export const selectListScoreByProfile = (profile: string) => supabase
    .from(SUPABASE_LISTSCORE_TABLE)
    .select("*, list(*)")
    .eq("profile", profile);