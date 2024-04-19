import { FavoriteInsert } from "src/models/Favorite";
import { supabase } from "./supabase";

export const SUPABASE_FAVORITE_TABLE = "favorite";

export const selectMyFavorite = (profile: string) =>
  supabase.from(SUPABASE_FAVORITE_TABLE).select().eq("profile", profile);

export const insertFavorite = (value: FavoriteInsert) =>
  supabase.from(SUPABASE_FAVORITE_TABLE).insert(value);

export const deleteFavoriteById = (id: number) =>
  supabase.from(SUPABASE_FAVORITE_TABLE).delete().eq("id", id);
