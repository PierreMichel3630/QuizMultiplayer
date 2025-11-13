import { supabase } from "./supabase";

export const getComparePlayers = (
  player1: string,
  player2: string,
  search: string,
  language: number,
  sort: string,
  page: number
) => {
  return supabase.rpc("compare_players", {
    player1_uuid: player1,
    player2_uuid: player2,
    search: search,
    language_id: language,
    sort_by: sort,
    page: page,
  });
};
