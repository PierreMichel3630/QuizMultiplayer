import { PrivateGameInsert } from "src/models/Game";
import { supabase } from "./supabase";
import { BattleGameInsert, BattleGameUpdate } from "src/models/BattleGame";

export const SUPABASE_RESPONSESOLOGAME_FUNCTION = "response-solo-game";
export const SUPABASE_LAUNCHSOLOGAME_FUNCTION = "launch-solo-game";

export const SUPABASE_LAUNCHTRAININGGAME_FUNCTION = "launch-training-game";
export const SUPABASE_QUESTIONTRAININGGAME_FUNCTION = "question-training-game";
export const SUPABASE_TRAININGGAME_TABLE = "traininggame";

export const SUPABASE_LAUNCHGAME_FUNCTION = "launch-game";
export const SUPABASE_GAME_TABLE = "game";
export const SUPABASE_SOLOGAME_TABLE = "sologame";

export const SUPABASE_DUELGAME_TABLE = "duelgame";
export const SUPABASE_LAUNCHDUELGAME_FUNCTION = "launch-duel-game";
export const SUPABASE_MATCHMAKINGDUELGAME_FUNCTION = "matchmaking-duel-game";

export const SUPABASE_BATTLEGAME_TABLE = "battlegame";
export const SUPABASE_LAUNCHBATTLEGAME_FUNCTION = "matchmaking-duel-game";

//BATTLE GAME

export const deleteBattleByUuid = (uuid: string) =>
  supabase.from(SUPABASE_BATTLEGAME_TABLE).delete().eq("uuid", uuid);

export const insertBattleGame = (value: BattleGameInsert) =>
  supabase.from(SUPABASE_BATTLEGAME_TABLE).insert(value).select().maybeSingle();

export const selectBattleGameByUuid = (uuid: string) =>
  supabase
    .from(SUPABASE_BATTLEGAME_TABLE)
    .select("*, player1(*, avatar(*)), player2(*, avatar(*))")
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
    .or(`player2.eq.${uuid},player1.eq.${uuid}`);

//TRAINING GAME
export const launchTrainingGame = (player: string, theme: number) =>
  supabase.functions.invoke(SUPABASE_LAUNCHTRAININGGAME_FUNCTION, {
    body: { player: player, theme: theme },
  });

export const getQuestionTrainingGame = (game: string) =>
  supabase.functions.invoke(SUPABASE_QUESTIONTRAININGGAME_FUNCTION, {
    body: { game: game },
  });

export const deleteTrainingGame = (game: string) =>
  supabase.functions.invoke(SUPABASE_QUESTIONTRAININGGAME_FUNCTION, {
    body: { game: game, delete: true },
  });

export const selectTrainingGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_TRAININGGAME_TABLE)
    .select("*, theme!traininggame_theme_fkey(*)")
    .eq("uuid", uuid)
    .maybeSingle();

//SOLO GAME
export const launchSoloGame = (player: string, theme: number) =>
  supabase.functions.invoke(SUPABASE_LAUNCHSOLOGAME_FUNCTION, {
    body: { player: player, theme: theme },
  });

export const selectSoloGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_SOLOGAME_TABLE)
    .select("*, theme!public_sologame_theme_fkey(*), themequestion(*)")
    .eq("uuid", uuid)
    .maybeSingle();

export const responseSoloGame = (
  game: number,
  response: string,
  language: string
) =>
  supabase.functions.invoke(SUPABASE_RESPONSESOLOGAME_FUNCTION, {
    body: { game: game, response: response, language: language },
  });

//DUEL GAME
export const deleteDuelByUuid = (uuid: string) =>
  supabase.from(SUPABASE_DUELGAME_TABLE).delete().eq("uuid", uuid);

export const selectInvitationDuelByUuid = (uuids: Array<string>) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*)), player2(*, avatar(*)), theme!public_duelgame_theme_fkey(*)"
    )
    .in("uuid", uuids)
    .eq("start", false);

export const selectInvitationDuelByUser = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*)), player2(*, avatar(*)), theme!public_duelgame_theme_fkey(*)"
    )
    .eq("player2", uuid)
    .eq("start", false);

export const selectDuelGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*), title(*), badge(*)), player2(*, avatar(*), title(*), badge(*)), theme!public_duelgame_theme_fkey(*)"
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

export const matchmakingDuelGame = (player: string, theme: number) =>
  supabase.functions.invoke(SUPABASE_MATCHMAKINGDUELGAME_FUNCTION, {
    body: { player: player, theme: theme },
  });

//PUBLIC GAME
export const launchGameByGameId = (id: number) =>
  supabase.functions.invoke(SUPABASE_LAUNCHGAME_FUNCTION, {
    body: { game: id },
  });

export const selectGameByTheme = (id: number) =>
  supabase.from(SUPABASE_GAME_TABLE).select().eq("theme", id).maybeSingle();

export const selectGameByChannel = (channel: string) =>
  supabase
    .from(SUPABASE_GAME_TABLE)
    .select()
    .eq("channel", channel)
    .maybeSingle();

export const selectGames = () =>
  supabase.from(SUPABASE_GAME_TABLE).select().eq("type", "PUBLIC");

export const insertPrivateGame = (game: PrivateGameInsert) =>
  supabase.from(SUPABASE_GAME_TABLE).insert(game).select().maybeSingle();
