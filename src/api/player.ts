import { supabase } from "./supabase";

export const SUPABASE_PLAYER_TABLE = "gameplayer";

export const selectPlayersByGame = (id: number) =>
  supabase.from(SUPABASE_PLAYER_TABLE).select().eq("game", id);
