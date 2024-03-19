import { UserUpdate } from "src/models/User";
import { supabase } from "./supabase";

export const updateUser = (value: UserUpdate) =>
  supabase.auth.updateUser(value);
