import { Language } from "src/models/Language";
import { supabase } from "./supabase";

export const SUPABASE_ANSWERTRANSLATION_TABLE = "answertranslation";

export const searchAnswerByLanguageAndSet = (
  answerset: number,
  language: Language,
  search: string
) =>
  supabase
    .from(SUPABASE_ANSWERTRANSLATION_TABLE)
    .select("*, answer!inner(*)")
    .eq("language", language.id)
    .eq("answer.answerset", answerset)
    .ilike("label", `%${search}%`);
