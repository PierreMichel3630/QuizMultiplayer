import moment, { Moment } from "moment";
import { BattleGameInsert, BattleGameUpdate } from "src/models/BattleGame";
import { ClassementSoloTimeEnum } from "src/models/enum/ClassementEnum";
import { Language } from "src/models/Language";
import { FilterGame } from "src/pages/HistoryGamePage";
import { ConfigTraining } from "src/pages/play/ConfigTrainingPage";
import { supabase } from "./supabase";
import { VERSION_QUESTION } from "src/utils/config";

export const SUPABASE_PREVIOUSTHEMES_TABLE = "previousthemes";
export const SUPABASE_HISTORYGAMES_TABLE = "historygamesv2";
export const SUPABASE_HISTORYSOLOGAMES_TABLE = "viewhistorysologames";

export const SUPABASE_LAUNCHSOLOGAME_FUNCTION = "launch-solo-gameV2";
export const SUPABASE_ENDSOLOGAME_FUNCTION = "end-solo-game";

export const SUPABASE_SOLOGAME_TABLE = "sologame";

export const SUPABASE_LAUNCHTRAININGGAME_FUNCTION = "launch-training-game";
export const SUPABASE_QUESTIONTRAININGGAME_FUNCTION =
  "question-training-gameV3";
export const SUPABASE_TRAININGGAME_TABLE = "traininggame";

export const SUPABASE_DUELGAME_TABLE = "duelgame";
export const SUPABASE_LAUNCHDUELGAME_FUNCTION = "launch-duel-gameV2";
export const SUPABASE_MATCHMAKINGDUELGAME_FUNCTION = "matchmaking-duel-gameV3";
export const SUPABASE_ENDDUELGAME_FUNCTION = "end-duel-game";

export const SUPABASE_BATTLEGAME_TABLE = "battlegame";

//BATTLE GAME

export const deleteBattleByUuid = (uuid: string) =>
  supabase.from(SUPABASE_BATTLEGAME_TABLE).delete().eq("uuid", uuid);

export const insertBattleGame = (value: BattleGameInsert) =>
  supabase.from(SUPABASE_BATTLEGAME_TABLE).insert(value).select().maybeSingle();

export const selectBattleGameByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_BATTLEGAME_TABLE)
    .select(
      "*, player1(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), player2(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))"
    )
    .eq("uuid", uuid)
    .maybeSingle();

export const updateBattleGameByUuid = (value: BattleGameUpdate) =>
  supabase
    .from(SUPABASE_BATTLEGAME_TABLE)
    .update(value)
    .eq("uuid", value.uuid)
    .select("*, player1(*, avatar(*)), player2(*, avatar(*))")
    .maybeSingle();

export const selectInvitationBattleByUuid = (uuids: Array<string>) =>
  supabase
    .from(SUPABASE_BATTLEGAME_TABLE)
    .select("*, player1(*, avatar(*)), player2(*, avatar(*))")
    .in("uuid", uuids);

export const selectInvitationBattleByUser = (uuid: string) =>
  supabase
    .from(SUPABASE_BATTLEGAME_TABLE)
    .select("*, player1(*, avatar(*)), player2(*, avatar(*))")
    .not("player2", "is", null)
    .or(`player2.eq.${uuid},player1.eq.${uuid}`);

//TRAINING GAME
export const launchTrainingGame = (
  player: string,
  theme: number,
  configGame: ConfigTraining,
  language: Language
) =>
  supabase.functions.invoke(SUPABASE_LAUNCHTRAININGGAME_FUNCTION, {
    body: {
      player: player,
      theme: theme,
      config: configGame,
      language: language.id,
    },
  });

export const getQuestionTrainingGame = (
  game: string,
  questions: Array<unknown>
) =>
  supabase.functions.invoke(SUPABASE_QUESTIONTRAININGGAME_FUNCTION, {
    body: { game: game, questions: questions },
  });

export const selectTrainingGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_TRAININGGAME_TABLE)
    .select(
      "*, theme!traininggame_theme_fkey(* ,themetranslation!inner(name, language(*)))"
    )
    .eq("uuid", uuid)
    .maybeSingle();

//SOLO GAME
export const launchSoloGame = (
  player: string,
  theme: number,
  language: Language
) =>
  supabase.functions.invoke(SUPABASE_LAUNCHSOLOGAME_FUNCTION, {
    body: {
      player: player,
      theme: theme,
      language: language.id,
      version: VERSION_QUESTION,
    },
  });

export const endSoloGame = (questions: Array<unknown>, gameUuid: string) =>
  supabase.functions.invoke(SUPABASE_ENDSOLOGAME_FUNCTION, {
    body: {
      questions,
      gameUuid,
    },
  });

export const selectSoloGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_SOLOGAME_TABLE)
    .select(
      "*, theme!public_sologame_theme_fkey(* ,themetranslation!inner(name, language(*))), themequestion(* ,themetranslation!inner(name, language(*)))"
    )
    .eq("uuid", uuid)
    .maybeSingle();

export const selectSoloGameByDate = (
  language: Language,
  page: number,
  itemperpage = 25,
  start = undefined as Moment | undefined
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_SOLOGAME_TABLE)
    .select(
      "*, profile(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!sologame_themequestion_fkey(color,image ,themetranslation!inner(name, language(*)))"
    )
    .not("theme", "is", null)
    .eq("theme.themetranslation.language", language.id)
    .not("theme.themetranslation.language", "is", null);
  if (start) {
    query = query.gte("created_at", start.toISOString());
  }
  return query.order("points", { ascending: false }).range(from, to);
};

//DUEL GAME
export const deleteDuelByUuid = (uuid: string) =>
  supabase.from(SUPABASE_DUELGAME_TABLE).delete().eq("uuid", uuid);

export const cancelDuelByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .update({ status: "CANCEL" })
    .eq("uuid", uuid);

export const selectInvitationDuelByUuid = (uuids: Array<string>) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*)), player2(*, avatar(*)), theme!public_duelgame_theme_fkey(*, themetranslation(*))"
    )
    .in("uuid", uuids)
    .eq("status", "WAIT");

export const selectInvitationDuelByUser = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*)), player2(*, avatar(*)), theme!public_duelgame_theme_fkey(*, themetranslation(*))"
    )
    .eq("player2", uuid)
    .eq("status", "WAIT");

export const selectDuelGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), player2(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!public_duelgame_theme_fkey(*, themetranslation(*))"
    )
    .eq("uuid", uuid)
    .maybeSingle();

export const launchDuelGame = (
  player1: string,
  player2: string,
  theme: number,
  battlegame?: string
) =>
  supabase.functions.invoke(SUPABASE_LAUNCHDUELGAME_FUNCTION, {
    body: {
      player1: player1,
      player2: player2,
      theme: theme,
      battlegame: battlegame,
    },
  });

export const matchmakingDuelGame = (
  player: string,
  theme: number,
  language: Language
) =>
  supabase.functions.invoke(SUPABASE_MATCHMAKINGDUELGAME_FUNCTION, {
    body: { player: player, theme: theme, language: language.id },
  });

export const endDuelGame = (
  questions: Array<unknown>,
  gameUuid: string,
  player: string
) =>
  supabase.functions.invoke(SUPABASE_ENDDUELGAME_FUNCTION, {
    body: {
      questions,
      gameUuid,
      player,
    },
  });

// HISTORY

export const selectLastXThemeByPlayer = (player: string, x: number) => {
  return supabase
    .from(SUPABASE_PREVIOUSTHEMES_TABLE)
    .select("*, theme(*)")
    .eq("player", player)
    .limit(x);
};

export const selectSoloGames = (
  filter: FilterGame,
  page: number,
  itemperpage: number
) => {
  const player = filter.player ? filter.player.id : undefined;
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_SOLOGAME_TABLE)
    .select(
      "uuid, points,created_at, profile(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!sologame_themequestion_fkey(color, image,themetranslation!inner(name, language(*)))"
    );
  if (player) {
    query = query.eq("profile.id", player);
  }

  return query
    .not("profile", "is", null)
    .not("theme", "is", null)
    .range(from, to)
    .order("created_at", { ascending: false });
};

export const selectDuelGames = (
  filter: FilterGame,
  page: number,
  itemperpage: number
) => {
  const player = filter.player ? filter.player.id : undefined;
  const opponent = filter.opponent ? filter.opponent.id : undefined;
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "uuid, ptsplayer1, ptsplayer2, created_at,created_at, player1(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), player2(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!public_duelgame_theme_fkey(color, image,themetranslation!inner(name, language(*)))"
    );

  if (player || opponent) {
    const queryPlayer = opponent
      ? `and(player1.id.eq.${player},player2.id.eq.${opponent}),and(player2.id.eq.${player},player1.id.eq.${opponent})`
      : `player2.eq.${player},player1.eq.${player}`;
    query = query.or(queryPlayer);
  }

  return query
    .not("theme", "is", null)
    .range(from, to)
    .order("created_at", { ascending: false });
};

export const selectGamesByTime = (
  time: ClassementSoloTimeEnum,
  page: number,
  itemperpage = 25,
  language = "fr-FR",
  idsProfile = [] as Array<string>
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  const dateEnd = moment();
  let dateStart = moment().subtract(7, "days");
  if (time === ClassementSoloTimeEnum.day) {
    dateStart = moment().subtract(1, "days");
  } else if (time === ClassementSoloTimeEnum.week) {
    dateStart = moment().subtract(7, "days");
  } else if (time === ClassementSoloTimeEnum.month) {
    dateStart = moment().subtract(1, "months");
  }

  let query = supabase
    .from(SUPABASE_HISTORYSOLOGAMES_TABLE)
    .select("id, points, profile, theme!sologame_themequestion_fkey(*)")
    .lt("created_at", dateEnd.toISOString())
    .gt("created_at", dateStart.toISOString())
    .eq("theme.language", language)
    .not("theme", "is", null);

  if (idsProfile.length > 0) {
    query = query.in("player", idsProfile);
  }

  return query.order("points", { ascending: false }).range(from, to);
};
