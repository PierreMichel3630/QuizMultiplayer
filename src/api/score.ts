import { bots } from "./bots";
import { supabase } from "./supabase";

export const SUPABASE_SCORE_TABLE = "score";
export const SUPABASE_OPPOSITION_TABLE = "opposition";

export const selectScoresByTheme = (
  theme: number,
  order: string,
  itemperpage = 25,
  page = 0
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  return supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, profile(*, avatar(*)), uuidgame(uuid, created_at)")
    .gt(order, 0)
    .eq("theme", theme)
    .not("profile", "in", `(${bots.join(",")})`)
    .order(order, { ascending: false })
    .order("uuidgame(created_at)", { ascending: false })
    .range(from, to);
};

export const selectScoresByProfile = (uuid: string) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, theme(*)")
    .or("games.gt.0,duelgames.gt.0")
    .eq("profile", uuid);

export const selectScoreByThemeAndPlayer = (player: string, theme: number) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*")
    .eq("profile", player)
    .eq("theme", theme)
    .maybeSingle();

export const selectScore = (
  order: string,
  page: number,
  itemperpage = 25,
  ids = [] as Array<number>
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;
  let query = supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*, profile(*, avatar(*)), theme(*), uuidgame(uuid, created_at)")
    .gt(order, 0)
    .not("profile", "in", `(${bots.join(",")})`);
  if (ids.length > 0) {
    query = query.in("theme", ids);
  }
  return query
    .order(order, { ascending: false })
    .order("uuidgame(created_at)", { ascending: false })
    .range(from, to);
};

export const countPlayersByTheme = (theme: number) =>
  supabase
    .from(SUPABASE_SCORE_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("theme", theme);

//Opposition

export const selectOppositionByOpponent = (player1: string, player2: string) =>
  supabase
    .from(SUPABASE_OPPOSITION_TABLE)
    .select("*")
    .eq("player1", player1)
    .eq("player2", player2);
