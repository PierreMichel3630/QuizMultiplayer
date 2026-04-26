import { Moment } from "moment";
import { ChallengeGameInsert, ChallengeGameUpdate } from "src/models/Challenge";
import { VERSION_QUESTION } from "src/utils/config";
import { supabase } from "./supabase";

export const SUPABASE_CHALLENGE_TABLE = "challenge";
export const SUPABASE_CHALLENGEGAME_TABLE = "challengegame";
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
  search = "",
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
  id: string,
) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select("* , challenge(*)", { count: "exact", head: true })
    .eq("profile", id)
    .not("challenge", "is", null)
    .eq("challenge.date", date.format("YYYY-MM-DD"));

export const selectChallengeGameByDateAndProfileId = (
  date: Moment,
  id: string,
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
  itemperpage: number,
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select(
      "* , challenge(*), profile(*, titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), avatar(*), badge(*), banner(*), country(*))",
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
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)",
    )
    .eq("uuid", uuid)
    .maybeSingle();

export const deleteChallengeGameById = (id: number) =>
  supabase.from(SUPABASE_CHALLENGEGAME_TABLE).delete().eq("id", id);

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
  date: string, // Format YYYY-MM-DD
) => {
  return supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)",
    )
    .eq("challenge.date", date)
    .not("challenge", "is", null)
    .not("profile", "is", null)
    .order("score", { ascending: false })
    .order("time", { ascending: true })
    .limit(1)
    .maybeSingle();
};

export const selectBestRankingChallengeByDay = () => {
  return supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)",
    )
    .not("challenge", "is", null)
    .not("profile", "is", null)
    .order("score", { ascending: false })
    .order("time", { ascending: true })
    .limit(1)
    .maybeSingle();
};

// AUTRE

export const selectRankingChallengeByDateAndProfileId = (
  date: Moment,
  profileId: string,
) =>
  supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "*, profile(*, title(*, titletranslation(*, language(*))), avatar(*), badge(*), banner(*), country(*)), challenge(*)",
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

/***************   NEW    *************/

// Global
export const SUPABASE_GETLEADERBOARDCHALLENGEDAY_FUNCTION =
  "get_leaderboard_challenge_day";
export const SUPABASE_GETLEADERBOARDCHALLENGEWEEK_FUNCTION =
  "get_leaderboard_challenge_week";
export const SUPABASE_GETLEADERBOARDCHALLENGEMONTH_FUNCTION =
  "get_leaderboard_challenge_month";
export const SUPABASE_GETLEADERBOARDCHALLENGEALLTIME_FUNCTION =
  "get_leaderboard_challenge_alltime";

export const selectChallengeAllTimeByProfile = (profileId: string) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEALLTIME_FUNCTION, {
    p_search: "",
    p_page: 0,
    p_itemperpage: 1,
    p_ascending: false,
    p_sort: "score",
    p_ids_profile: [profileId],
  });
};

export const selectChallengeAllTimePaginate = (
  search: string = "",
  sort: string = "score",
  order = false,
  page = 0,
  itemperpage = 25,
  idFriends?: Array<string>,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEALLTIME_FUNCTION, {
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ascending: order,
    p_sort: sort,
    p_ids_profile: idFriends ?? null,
  });
};

export const selectChallengeMonthPaginate = (
  date: string,
  search: string = "",
  sort: string = "score",
  order = false,
  page = 0,
  itemperpage = 25,
  idFriends?: Array<string>,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEMONTH_FUNCTION, {
    p_date: date,
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ascending: order,
    p_sort: sort,
    p_ids_profile: idFriends ?? null,
  });
};

export const selectChallengeMonthByProfileId = (
  date: string | null,
  profileId: string,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEMONTH_FUNCTION, {
    p_date: date,
    p_search: "",
    p_page: 0,
    p_itemperpage: 1,
    p_ascending: false,
    p_sort: "score",
    p_ids_profile: [profileId],
  });
};

export const selectChallengeWeekPaginate = (
  date: string,
  search: string = "",
  sort: string = "score",
  order = false,
  page = 0,
  itemperpage = 25,
  idFriends?: Array<string>,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEWEEK_FUNCTION, {
    p_date: date,
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ascending: order,
    p_sort: sort,
    p_ids_profile: idFriends ?? null,
  });
};

export const selectChallengeWeekByProfileId = (
  date: string | null,
  profileId: string,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEWEEK_FUNCTION, {
    p_date: date,
    p_search: "",
    p_page: 0,
    p_itemperpage: 1,
    p_ascending: false,
    p_sort: "score",
    p_ids_profile: [profileId],
  });
};

export const selectChallengeDayPaginate = (
  date: Moment,
  search: string = "",
  sort: string = "score",
  order = false,
  page = 0,
  itemperpage = 25,
  idFriends?: Array<string>,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEDAY_FUNCTION, {
    p_date: date.format("YYYY-MM-DD"),
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ascending: order,
    p_sort: sort,
    p_ids_profile: idFriends ?? null,
  });
};

export const selectChallengeDayByProfileId = (
  date: string | null,
  profileId: string,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDCHALLENGEDAY_FUNCTION, {
    p_date: date,
    p_search: "",
    p_page: 0,
    p_itemperpage: 1,
    p_ascending: false,
    p_sort: "score",
    p_ids_profile: [profileId],
  });
};

// Par profile
export const SUPABASE_GETCHALLENGEWEEKLYRANKING_FUNCTION =
  "get_challenge_weekly_ranking";
export const SUPABASE_GETCHALLENGEMONTHLYRANKING_FUNCTION =
  "get_challenge_monthly_ranking";
export const SUPABASE_GETCHALLENGEDAILYRANKING_FUNCTION =
  "get_challenge_daily_ranking";

export const selectRankingChallengeWeekByProfileId = (
  id: string,
  page = 0,
  itemperpage = 25,
) => {
  return supabase.rpc(SUPABASE_GETCHALLENGEWEEKLYRANKING_FUNCTION, {
    p_profile: id,
    p_limit: itemperpage,
    p_offset: page * itemperpage,
  });
};

export const selectRankingChallengeMonthByProfileId = (
  id: string,
  page = 0,
  itemperpage = 25,
) => {
  return supabase.rpc(SUPABASE_GETCHALLENGEMONTHLYRANKING_FUNCTION, {
    p_profile: id,
    p_limit: itemperpage,
    p_offset: page * itemperpage,
  });
};

export const selectChallengeGameByProfileId = (
  id: string,
  page = 0,
  itemperpage = 25,
) => {
  return supabase.rpc(SUPABASE_GETCHALLENGEDAILYRANKING_FUNCTION, {
    p_profile: id,
    p_limit: itemperpage,
    p_offset: page * itemperpage,
  });
};
