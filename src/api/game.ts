import { BattleGameInsert, BattleGameUpdate } from "src/models/BattleGame";
import { Language } from "src/models/Language";
import { FilterGame } from "src/pages/HistoryGamePage";
import { ConfigTraining } from "src/pages/play/ConfigTrainingPage";
import { VERSION_QUESTION } from "src/utils/config";
import { supabase } from "./supabase";
const SUPABASE_LASTPLAYEDTHEME_FUNCTION = "get_last_played_themes";

const SUPABASE_LAUNCHSOLOGAME_FUNCTION = "launch-solo-gameV2";
const SUPABASE_ENDSOLOGAME_FUNCTION = "end-solo-game";

const SUPABASE_SOLOGAME_TABLE = "sologame";

const SUPABASE_LAUNCHTRAININGGAME_FUNCTION = "launch-training-game";
const SUPABASE_QUESTIONTRAININGGAME_FUNCTION = "question-training-gameV3";
const SUPABASE_TRAININGGAME_TABLE = "traininggame";

const SUPABASE_DUELGAME_TABLE = "duelgame";
const SUPABASE_LAUNCHDUELGAME_FUNCTION = "launch-duel-gameV2";
const SUPABASE_MATCHMAKINGDUELGAME_FUNCTION = "matchmaking-duel-gameV3";
const SUPABASE_ENDDUELGAME_FUNCTION = "end-duel-game";

const SUPABASE_BATTLEGAME_TABLE = "battlegame";

// LAST PLAYED THEME
export const selectLastPlayedThemeByProfile = (uuid: string, limit = 10) =>
  supabase.rpc(SUPABASE_LASTPLAYEDTHEME_FUNCTION, {
    player_id: uuid,
    result_number: limit,
  });

//BATTLE GAME

export const deleteBattleByUuid = (uuid: string) =>
  supabase.from(SUPABASE_BATTLEGAME_TABLE).delete().eq("uuid", uuid);

export const insertBattleGame = (value: BattleGameInsert) =>
  supabase.from(SUPABASE_BATTLEGAME_TABLE).insert(value).select().maybeSingle();

export const selectBattleGameByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_BATTLEGAME_TABLE)
    .select(
      "*, player1(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), player2(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))",
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

//TRAINING GAME
export const launchTrainingGame = (
  player: string,
  theme: number,
  configGame: ConfigTraining,
  language: Language,
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
  questions: Array<unknown>,
) =>
  supabase.functions.invoke(SUPABASE_QUESTIONTRAININGGAME_FUNCTION, {
    body: { game: game, questions: questions },
  });

export const selectTrainingGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_TRAININGGAME_TABLE)
    .select(
      "*, theme!traininggame_theme_fkey(* ,themetranslation!inner(name, language(*)))",
    )
    .eq("uuid", uuid)
    .maybeSingle();

//SOLO GAME
export const launchSoloGame = (
  player: string,
  theme: number,
  language: Language,
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
      "*, theme!public_sologame_theme_fkey(* ,themetranslation!inner(name, language(*))), themequestion(* ,themetranslation!inner(name, language(*)))",
    )
    .eq("uuid", uuid)
    .maybeSingle();


//DUEL GAME

export const cancelDuelByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .update({ status: "CANCEL" })
    .eq("uuid", uuid);

export const selectDuelGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), player2(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!public_duelgame_theme_fkey(*, themetranslation(*))",
    )
    .eq("uuid", uuid)
    .maybeSingle();

export const launchDuelGame = (
  player1: string,
  player2: string,
  theme: number,
  battlegame?: string,
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
  language: Language,
) =>
  supabase.functions.invoke(SUPABASE_MATCHMAKINGDUELGAME_FUNCTION, {
    body: { player: player, theme: theme, language: language.id },
  });

export const endDuelGame = (
  questions: Array<unknown>,
  gameUuid: string,
  player: string,
) =>
  supabase.functions.invoke(SUPABASE_ENDDUELGAME_FUNCTION, {
    body: {
      questions,
      gameUuid,
      player,
    },
  });

// HISTORY

export const selectSoloGames = (
  filter: FilterGame,
  page: number,
  itemperpage: number,
) => {
  const player = filter.player ? filter.player.id : undefined;
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_SOLOGAME_TABLE)
    .select(
      "uuid, points,created_at, profile(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!sologame_themequestion_fkey(color, image,themetranslation!inner(name, language(*)))",
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
  itemperpage: number,
) => {
  const player = filter.player ? filter.player.id : undefined;
  const opponent = filter.opponent ? filter.opponent.id : undefined;
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "uuid, ptsplayer1, ptsplayer2, created_at,created_at, player1(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), player2(*, avatar(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))), badge(*), banner(*), country(*)), theme!public_duelgame_theme_fkey(color, image,themetranslation!inner(name, language(*)))",
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
