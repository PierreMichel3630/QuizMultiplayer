import { VoteTheme, VoteThemeInsert } from "src/models/Vote";
import { supabase } from "./supabase";

export const SUPABASE_VOTETHEME_TABLE = "votetheme";
const SUPABASE_VOTE_THEME_FUNCTION = "vote-theme";

export const selectVoteTheme = () =>
  supabase.from(SUPABASE_VOTETHEME_TABLE).select();

export const insertVoteTheme = (value: VoteThemeInsert) =>
  supabase.from(SUPABASE_VOTETHEME_TABLE).insert(value).select().single();

export const voteTheme = (theme: VoteTheme) =>
  supabase.functions.invoke(SUPABASE_VOTE_THEME_FUNCTION, {
    body: { theme: theme },
  });
