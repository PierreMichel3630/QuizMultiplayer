import { PrivateGameInsert } from "src/models/Game";
import { supabase } from "./supabase";

export const SUPABASE_RESPONSESOLOGAME_FUNCTION = "response-solo-game";
export const SUPABASE_LAUNCHSOLOGAME_FUNCTION = "launch-solo-game";
export const SUPABASE_LAUNCHGAME_FUNCTION = "launch-game";
export const SUPABASE_GAME_TABLE = "game";

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
