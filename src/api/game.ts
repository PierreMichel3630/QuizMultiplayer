import { BattleGameInsert, BattleGameUpdate } from "src/models/BattleGame";
import { FilterGame } from "src/pages/HistoryGamePage";
import { supabase } from "./supabase";

export const SUPABASE_HISTORYGAMES_TABLE = "historygames";

export const SUPABASE_RESPONSESOLOGAME_FUNCTION = "response-solo-game";
export const SUPABASE_LAUNCHSOLOGAME_FUNCTION = "launch-solo-game";
export const SUPABASE_SOLOGAME_TABLE = "sologame";

export const SUPABASE_LAUNCHTRAININGGAME_FUNCTION = "launch-training-game";
export const SUPABASE_QUESTIONTRAININGGAME_FUNCTION = "question-training-game";
export const SUPABASE_TRAININGGAME_TABLE = "traininggame";

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
    .not("player2", "is", null)
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
    .eq("status", "WAIT");

export const selectInvitationDuelByUser = (uuid: string) =>
  supabase
    .from(SUPABASE_DUELGAME_TABLE)
    .select(
      "*, player1(*, avatar(*)), player2(*, avatar(*)), theme!public_duelgame_theme_fkey(*)"
    )
    .eq("player2", uuid)
    .eq("status", "WAIT");

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

// HISTORY

export const selectGamesByPlayer = (
  filter: FilterGame,
  page: number,
  itemperpage: number
) => {
  const player = filter.player ? filter.player.id : undefined;
  const opponent = filter.opponent ? filter.opponent.id : undefined;
  const types = filter.type === "ALL" ? ["SOLO", "DUEL"] : [filter.type];
  const themes = filter.themes.map((el) => el.id);
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  const queryPlayer = opponent
    ? `and(player1->>id.eq.${player},player2->>id.eq.${opponent}),and(player2->>id.eq.${player},player1->>id.eq.${opponent})`
    : `player2->>id.eq.${player},player1->>id.eq.${player}`;
  return themes.length > 0
    ? supabase
        .from(SUPABASE_HISTORYGAMES_TABLE)
        .select()
        .or(queryPlayer)
        .in("type", types)
        .filter("theme->>id", "in", `(${themes})`)
        .range(from, to)
    : supabase
        .from(SUPABASE_HISTORYGAMES_TABLE)
        .select()
        .or(queryPlayer)
        .in("type", types)
        .range(from, to);
};

export const selectGames = (
  filter: FilterGame,
  page: number,
  itemperpage: number
) => {
  const player = filter.player ? filter.player.id : undefined;
  const opponent = filter.opponent ? filter.opponent.id : undefined;
  const types = filter.type === "ALL" ? ["SOLO", "DUEL"] : [filter.type];
  const themes = filter.themes.map((el) => el.id);
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase.from(SUPABASE_HISTORYGAMES_TABLE).select();

  if (opponent && player) {
    query = query.or(
      `and(player1->>id.eq.${player},player2->>id.eq.${opponent}),and(player2->>id.eq.${player},player1->>id.eq.${opponent})`
    );
  } else if (player) {
    query = query.or(`player2->>id.eq.${player},player1->>id.eq.${player}`);
  }

  query = query.in("type", types);

  if (themes.length > 0) {
    query = query.filter("theme->>id", "in", `(${themes})`);
  }
  query = query.range(from, to);
  return query;
};
