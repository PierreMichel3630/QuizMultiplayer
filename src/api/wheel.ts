import { supabase } from "./supabase";

const SUPABASE_LAUNCHWHEEL_FUNCTION = "launch-wheel"

export const launchWheel = () =>
  supabase.functions.invoke(SUPABASE_LAUNCHWHEEL_FUNCTION);