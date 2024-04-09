import { supabase } from "./supabase";

export const SUPABASE_COUNTRIES = "countries";

export const selectCountries = () => supabase.from(SUPABASE_COUNTRIES).select();
