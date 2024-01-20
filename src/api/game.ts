import { supabase } from "./supabase";

export const SUPABASE_LAUNCHGAME_FUNCTION = "launch-game";
export const SUPABASE_PUBLICGAME_TABLE = "publicgame";

export const launchGameByTheme = (id: number) =>
  supabase.functions.invoke(SUPABASE_LAUNCHGAME_FUNCTION, {
    body: { theme: id },
  });

export const selectGameByTheme = (id: number) =>
  supabase
    .from(SUPABASE_PUBLICGAME_TABLE)
    .select()
    .eq("theme", id)
    .maybeSingle();

export const selectGames = () =>
  supabase.from(SUPABASE_PUBLICGAME_TABLE).select();
