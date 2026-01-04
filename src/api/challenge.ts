import { Moment } from "moment";
import { ChallengeGameInsert, ChallengeGameUpdate } from "src/models/Challenge";
import { supabase } from "./supabase";
import { VERSION_QUESTION } from "src/utils/config";

export const SUPABASE_CHALLENGE_TABLE = "challenge";
export const SUPABASE_CHALLENGEGAME_TABLE = "challengegame";
export const SUPABASE_CHALLENGEGAMEALLTIME_VIEW = "viewchallengealltime";
export const SUPABASE_CHALLENGEGAMEMONTH_VIEW = "viewchallengemonth";
export const SUPABASE_CHALLENGEGAMEYEAR_VIEW = "viewchallengeyear";
export const SUPABASE_CHALLENGEGAMEWEEK_VIEW = "viewchallengeweek";
export const SUPABASE_CHALLENGEAVGGAMEDAY_VIEW = "viewavgchallengeday";
export const SUPABASE_RANKINGCHALLENGE_VIEW = "rankingchallenge";

export const SUPABASE_LAUNCHCHALLENGE_FUNCTION = "launch-challengeV3";
export const SUPABASE_ENDCHALLENGE_FUNCTION = "end-challenge";
export const SUPABASE_CREATECHALLENGE_FUNCTION = "create-challenge";

export const createChallenge = (date: string) =>
  supabase.functions.invoke(SUPABASE_CREATECHALLENGE_FUNCTION, {
    body: {
      date,
    },
  });

export const insertChallengeGame = (value: ChallengeGameInsert) =>
  supabase.from(SUPABASE_CHALLENGEGAME_TABLE).insert(value).select().single();

export const updateChallengeGame = (value: ChallengeGameUpdate) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const selectChallengeByDate = (date: Moment) =>
  supabase
    .from(SUPABASE_CHALLENGE_TABLE)
    .select()
    .eq("date", date.format("YYYY-MM-DD"))
    .maybeSingle();

export const countChallengeGameByDate = (
  date: Moment,
  idsProfile: undefined | Array<string> = undefined,
  search = ""
) => {
  let query = supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select("* , challenge(*), profile(username)", {
      count: "exact",
      head: true,
    })
    .not("challenge", "is", null)
    .eq("challenge.date", date.format("YYYY-MM-DD"))
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const countChallengeGameByDateAndProfileId = (
  date: Moment,
  id: string
) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select("* , challenge(*)", { count: "exact", head: true })
    .eq("profile", id)
    .not("challenge", "is", null)
    .eq("challenge.date", date.format("YYYY-MM-DD"));

export const selectChallengeGameByDateAndProfileId = (
  date: Moment,
  id: string
) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select("* , challenge(*)")
    .eq("profile", id)
    .not("profile", "is", null)
    .not("challenge", "is", null)
    .eq("challenge.date", date.format("YYYY-MM-DD"))
    .maybeSingle();

export const selectChallengeGameByDatePaginate = (
  date: Moment,
  search: string,
  page: number,
  itemperpage: number
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select(
      "* , challenge(*), profile(*, titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), avatar(*), badge(*), banner(*), country(*))"
    )
    .not("challenge", "is", null)
    .eq("challenge.date", date.format("YYYY-MM-DD"))
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null)
    .order("profile(username)", { ascending: true })
    .range(from, to);
};

export const selectChallengeGameByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)"
    )
    .eq("uuid", uuid)
    .maybeSingle();

export const deleteChallengeGameById = (id: number) =>
  supabase.from(SUPABASE_CHALLENGEGAME_TABLE).delete().eq("id", id);

export const selectChallengeGameByProfileId = (id: string) =>
  supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)"
    )
    .eq("profile.id", id)
    .not("profile", "is", null)
    .order("id", { ascending: false });

export const selectChallengeGameByProfileIdGroupByRating = (id: string) =>
  supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select("value:score.count(), label:score")
    .eq("profile", id);
export const selectChallengeGameByProfileIdGroupByRanking = (id: string) =>
  supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select("value:ranking.count(), label:ranking")
    .eq("profile", id);

export const selectRankingChallengeByDatePaginate = (
  date: Moment,
  search = "",
  page = 0,
  itemperpage = 5,
  sort = "ranking",
  ascending = true,
  idsProfile: undefined | Array<string> = undefined
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "uuid, ranking, id, time,score, profile(*, titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), avatar(*), badge(*), banner(*), country(*)), challenge(date, language)"
    )
    .eq("challenge.date", date.format("YYYY-MM-DD"))
    .not("challenge", "is", null)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);
  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query.range(from, to).order(sort, { ascending: ascending });
};

//DAY
export const selectAvgChallengeByDate = (date: Moment) => {
  return supabase
    .from(SUPABASE_CHALLENGEAVGGAMEDAY_VIEW)
    .select("*, challenge(date)")
    .eq("challenge.date", date.format("YYYY-MM-DD"))
    .not("challenge", "is", null)
    .maybeSingle();
};

export const selectFirstRankingChallengeByDay = (
  date: string // Format YYYY-MM-DD
) => {
  return supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)"
    )
    .eq("challenge.date", date)
    .not("challenge", "is", null)
    .not("profile", "is", null)
    .eq("ranking", 1)
    .maybeSingle();
};

export const selectBestRankingChallengeByDay = () => {
  return supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)"
    )
    .not("challenge", "is", null)
    .not("profile", "is", null)
    .order("score", { ascending: false })
    .order("time")
    .limit(1)
    .maybeSingle();
};

//ALLTIME
export const selectRankingChallengeAllTimePaginate = (
  search = "",
  page = 0,
  itemperpage = 5,
  sort = "ranking",
  ascending = true,
  idsProfile: undefined | Array<string> = undefined
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_CHALLENGEGAMEALLTIME_VIEW)
    .select(
      "*, profile(*, titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), avatar(*), badge(*), banner(*), country(*))"
    )
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }

  return query.range(from, to).order(sort, { ascending: ascending });
};

export const countRankingChallengeAllTime = (
  search = "",
  idsProfile: undefined | Array<string> = undefined
) => {
  let query = supabase
    .from(SUPABASE_CHALLENGEGAMEALLTIME_VIEW)
    .select("*, profile(*)", { count: "exact", head: true })
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);
  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const selectRankingChallengeAllTimeByProfileId = (id: string) =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEALLTIME_VIEW)
    .select("*")
    .eq("profile", id)
    .maybeSingle();

export const selectFirstRankingChallengeByAllTime = () => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEALLTIME_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .not("profile", "is", null)
    .eq("ranking", 1)
    .maybeSingle();
};

export const selectLastRankingChallengeByAllTime = () => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEALLTIME_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .not("profile", "is", null)
    .order("ranking", { ascending: false })
    .limit(1)
    .maybeSingle();
};

export const selectAvgChallengeByAllTime = () => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEALLTIME_VIEW)
    .select(
      "players:count(),games:games.avg(),score:score.avg(), time:time.avg()"
    )
    .maybeSingle();
};

// BY MONTH
export const selectRankingChallengeByMonthPaginate = (
  date: string, // Format MM/YYYY
  search = "",
  page = 0,
  itemperpage = 5,
  sort = "ranking",
  ascending = true,
  idsProfile: undefined | Array<string> = undefined
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select(
      "*, profile(*, titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("month", date)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query.range(from, to).order(sort, { ascending: ascending });
};

export const countRankingChallengeByMonth = (
  date: string,
  search = "",
  idsProfile: undefined | Array<string> = undefined
) => {
  let query = supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select("*, profile(*)", { count: "exact", head: true })
    .eq("month", date)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const selectRankingChallengeMonthByMonthAndProfileId = (
  date: string, // Format MM/YYYY
  id: string
) =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select("*")
    .eq("profile", id)
    .eq("month", date)
    .maybeSingle();

export const selectRankingChallengeMonthByProfileId = (id: string) =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select("*")
    .eq("profile", id)
    .order("month", { ascending: false });

export const selectFirstRankingChallengeByMonth = (
  date: string // Format MM/YYYY
) => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("month", date)
    .eq("ranking", 1)
    .not("profile", "is", null)
    .maybeSingle();
};

export const selectBestRankingChallengeByMonth = () => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .not("profile", "is", null)
    .order("score", { ascending: false })
    .order("time")
    .limit(1)
    .maybeSingle();
};

export const selectAvgChallengeByMonth = (date: Moment) => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEMONTH_VIEW)
    .select(
      "month,players:count(),games:games.avg(),score:score.avg(), time:time.avg()"
    )
    .eq("month", date.format("MM/YYYY"))
    .limit(1)
    .maybeSingle();
};

//BY YEAR
export const selectRankingChallengeByYearPaginate = (
  date: string, // Format YYYY
  search = "",
  page = 0,
  itemperpage = 5,
  sort = "ranking",
  ascending = true
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_CHALLENGEGAMEYEAR_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("year", date)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null)
    .range(from, to)
    .order(sort, { ascending: ascending });
};
export const countRankingChallengeByYear = (date: string, search = "") =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEYEAR_VIEW)
    .select("*, profile(*)", { count: "exact", head: true })
    .eq("year", date)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

export const selectRankingChallengeByYearAndProfileId = (
  date: string, // Format MM/YYYY
  id: string
) =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEYEAR_VIEW)
    .select("*")
    .eq("profile", id)
    .eq("year", date)
    .maybeSingle();

//BY WEEK
export const selectRankingChallengeByWeekPaginate = (
  date: string, // Format WW/YYYY
  search = "",
  page = 0,
  itemperpage = 5,
  sort = "ranking",
  ascending = true,
  idsProfile: undefined | Array<string> = undefined
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select(
      "*, profile(*, titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("week", date)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query.range(from, to).order(sort, { ascending: ascending });
};
export const countRankingChallengeByWeek = (
  date: string,
  search = "",
  idsProfile: undefined | Array<string> = undefined
) => {
  let query = supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select("*, profile(*)", { count: "exact", head: true })
    .eq("week", date)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const selectRankingChallengeWeekByWeekAndProfileId = (
  date: string, // Format WW/YYYY
  id: string
) =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select("*")
    .eq("profile", id)
    .eq("week", date)
    .maybeSingle();

export const selectRankingChallengeWeekByProfileId = (id: string) =>
  supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select("*")
    .eq("profile", id)
    .order("week", { ascending: false });

export const selectFirstRankingChallengeByWeek = (
  date: string // Format WW/YYYY
) => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("week", date)
    .eq("ranking", 1)
    .not("profile", "is", null)
    .maybeSingle();
};

export const selectBestRankingChallengeByWeek = () => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*))"
    )
    .not("profile", "is", null)
    .order("score", { ascending: false })
    .order("time")
    .limit(1)
    .maybeSingle();
};

export const selectAvgChallengeByWeek = (date: Moment) => {
  return supabase
    .from(SUPABASE_CHALLENGEGAMEWEEK_VIEW)
    .select(
      "week,players:count(),games:games.avg(),score:score.avg(), time:time.avg()"
    )
    .eq("week", date.format("WW/YYYY"))
    .limit(1)
    .maybeSingle();
};

// AUTRE

export const selectRankingChallengeByDateAndProfileId = (
  date: Moment,
  profileId: string
) =>
  supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)"
    )
    .eq("challenge.date", date.format("YYYY-MM-DD"))
    .eq("profile.id", profileId)
    .not("profile", "is", null)
    .not("challenge", "is", null)
    .maybeSingle();

export const launchChallenge = (date: string, language: number) =>
  supabase.functions.invoke(SUPABASE_LAUNCHCHALLENGE_FUNCTION, {
    body: {
      date,
      language,
      version: VERSION_QUESTION,
    },
  });

export const endChallenge = (questions: Array<unknown>, gameUuid: string) =>
  supabase.functions.invoke(SUPABASE_ENDCHALLENGE_FUNCTION, {
    body: {
      questions,
      gameUuid,
    },
  });
