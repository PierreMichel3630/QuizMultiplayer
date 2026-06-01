import { supabase } from "./supabase";

const SUPABASE_COUNTRIES = "countries";

export const selectCountries = () => supabase.from(SUPABASE_COUNTRIES).select();
