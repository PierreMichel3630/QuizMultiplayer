import { TypeGameMode } from "src/models/enum/GameMode";
import { supabase } from "./supabase";
import { OrderGameModeScore } from "src/models/GameMode";
import { Order } from "src/models/enum/Order";

const SUPABASE_GAMEMODESCORE_TABLE = "gamemodescore";
const SUPABASE_SAVEGAMEMODESCORE_FUNCTION = "savegamemodescore";

// Si DESC garde score le plus petit
export const saveGameModeScore = (
  score: number,
  typegame: TypeGameMode,
  order: Order = Order.ASC,
  extra: unknown = null,
) =>
  supabase.functions.invoke(SUPABASE_SAVEGAMEMODESCORE_FUNCTION, {
    body: { score, typegame, order, extra },
  });

export const countGameModeScore = (
  type: TypeGameMode,
  idsProfile: undefined | Array<string> = undefined,
  search = "",
) => {
  let query = supabase
    .from(SUPABASE_GAMEMODESCORE_TABLE)
    .select("*, profile(username)", {
      count: "exact",
      head: true,
    })
    .eq("type", type)
    .ilike("profile.username", `%${search}%`)
    .not("profile", "is", null);

  if (idsProfile) {
    query = query.in("profile.id", idsProfile);
  }
  return query;
};

export const getLeaderboardGameMode = (
  type: TypeGameMode,
  search = "",
  page = 0,
  itemperpage = 5,
  sort = OrderGameModeScore.SCORE,
  asc = Order.ASC,
  idsProfile: undefined | Array<string> = undefined,
) => {
  const from = page * itemperpage;
  return supabase.rpc("get_leaderboard_gamemodescore", {
    p_type: type,
    p_sort: sort,
    p_order: asc,
    p_search: search.length > 0 ? search : null,
    p_profile_ids: idsProfile ?? null,
    p_limit: itemperpage,
    p_offset: from,
  });
};
