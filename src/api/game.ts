import { PrivateGameInsert } from "src/models/Game";
import { supabase } from "./supabase";

export const SUPABASE_RESPONSESOLOGAME_FUNCTION = "response-solo-game";
export const SUPABASE_LAUNCHSOLOGAME_FUNCTION = "launch-solo-game";

export const SUPABASE_LAUNCHGAME_FUNCTION = "launch-game";
export const SUPABASE_GAME_TABLE = "game";

export const SUPABASE_DUELGAME_TABLE = "duelgame";
export const SUPABASE_RESPONSEDUELGAME_FUNCTION = "response-duel-game";
export const SUPABASE_LAUNCHDUELGAME_FUNCTION = "launch-duel-game";
export const SUPABASE_MATCHMAKINGDUELGAME_FUNCTION = "matchmaking-duel-game";

//SOLO GAME
export const launchSoloGame = (player: string, theme: number) =>
  supabase.functions.invoke(SUPABASE_LAUNCHSOLOGAME_FUNCTION, {
    body: { player: player, theme: theme },
  });
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
    .select("*, player1(*), player2(*), theme(*)")
    .in("uuid", uuids)
    .eq("start", false);

export const selectInvitationDuelByUser = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select("*, player1(*), player2(*), theme(*)")
    .eq("player2", uuid)
    .eq("start", false);

export const selectDuelGameById = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select("*, player1(*), player2(*), theme(*)")
    .eq("uuid", uuid)
    .maybeSingle();

export const launchDuelGame = (
  player1: string,
  player2: string,
  theme: number
) =>
  supabase.functions.invoke(SUPABASE_LAUNCHDUELGAME_FUNCTION, {
    body: { player1: player1, player2: player2, theme: theme },
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
