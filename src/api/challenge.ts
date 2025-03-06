import { Moment } from "moment";
import { supabase } from "./supabase";

export const SUPABASE_CHALLENGE_TABLE = "challenge";
export const SUPABASE_CHALLENGEGAME_TABLE = "challengegame";
export const SUPABASE_RANKINGCHALLENGE_VIEW = "rankingchallenge";

export const SUPABASE_LAUNCHCHALLENGE_FUNCTION = "launch-challenge";
export const SUPABASE_QUESTIONCHALLENGE_FUNCTION = "question-challenge";
export const SUPABASE_RESPONSECHALLENGE_FUNCTION = "response-challenge";

export const selectChallengeByDate = (date: Moment) =>
  supabase
    .from(SUPABASE_CHALLENGE_TABLE)
    .select()
    .eq("date", date.toISOString())
    .maybeSingle();

export const selectChallengeGameByChallengeId = (id: number) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select(
      "*, profile(*, title(*), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("challenge", id)
    .order("score", { ascending: false })
    .order("time", { ascending: true });

export const selectChallengeGameByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_CHALLENGEGAME_TABLE)
    .select()
    .eq("uuid", uuid)
    .maybeSingle();

export const selectRankingChallengeByChallengeId = (
  id: number,
  search: string
) =>
  supabase
    .from(SUPABASE_RANKINGCHALLENGE_VIEW)
    .select(
      "*, profile(*, title(*), avatar(*), badge(*), banner(*), country(*))"
    )
    .eq("challenge", id)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null)
    .order("ranking", { ascending: true });

export const launchChallenge = () =>
  supabase.functions.invoke(SUPABASE_LAUNCHCHALLENGE_FUNCTION);

export const getQuestionChallenge = (uuid: string) =>
  supabase.functions.invoke(SUPABASE_QUESTIONCHALLENGE_FUNCTION, {
    body: {
      game: uuid,
    },
  });

export const getResponseQuestionChallenge = (body: any) =>
  supabase.functions.invoke(SUPABASE_RESPONSECHALLENGE_FUNCTION, {
    body: body,
  });
