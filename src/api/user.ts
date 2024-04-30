import { UserUpdate } from "src/models/User";
import { supabase } from "./supabase";

export const SUPABASE_DELETEACCOUNT_FUNCTION = "delete-account";

export const updateUser = (value: UserUpdate) =>
  supabase.auth.updateUser(value);

export const deleteAccountUser = () =>
  supabase.functions.invoke(SUPABASE_DELETEACCOUNT_FUNCTION);
