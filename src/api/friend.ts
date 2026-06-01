import { FriendUpdate } from "src/models/Friend";
import { supabase } from "./supabase";

const SUPABASE_FRIEND_TABLE = "friend";

export const deleteFriendById = (id: string) =>
  supabase.from(SUPABASE_FRIEND_TABLE).delete().eq("id", id);

export const updateFriend = (value: FriendUpdate) =>
  supabase.from(SUPABASE_FRIEND_TABLE).update(value).eq("id", value.id);

export const selectFriendByProfileId = (id: string) =>
  supabase
    .from(SUPABASE_FRIEND_TABLE)
    .select(
      "*, user1(*, avatar(*), badge(*),country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*))))), user2(*, avatar(*), badge(*),country(*), titleprofile!profiles_titleprofile_fkey(*,title(*, titletranslation(*, language(*)))))",
    )
    .or(`user1.eq.${id},user2.eq.${id}`);
