import { supabase } from "./supabase";

export const getChannel = (name: string) => supabase.channel(name);
