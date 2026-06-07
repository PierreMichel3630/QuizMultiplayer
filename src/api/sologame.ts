import { Moment } from "moment";
import { supabase } from "./supabase";

const SUPABASE_GETLEADERBOARDSOLOGAME_FUNCTION = "get_leaderboard_gamesolo";

export const selectSoloGamePaginate = (
  search: string = "",
  page = 0,
  itemperpage = 25,
  sort: string = "points",
  ascending = false,
  idFriends?: Array<string>,
  idTheme?: Array<number>,
  dateStart?: Moment,
  dateEnd?: Moment,
) => {
  return supabase.rpc(SUPABASE_GETLEADERBOARDSOLOGAME_FUNCTION, {
    p_search: search,
    p_page: page,
    p_itemperpage: itemperpage,
    p_ascending: ascending,
    p_sort: sort,
    p_ids_profile: idFriends ?? null,
    p_ids_theme: idTheme ?? null,
    p_date_start: dateStart?.toISOString() ?? null,
    p_date_end: dateEnd?.toISOString() ?? null,
  });
};

