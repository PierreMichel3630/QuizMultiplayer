import { supabase } from "./supabase";

export const SUPABASE_QUESTION_TABLE = "question";

export const selectQuestionWithImage = () =>
  supabase.from(SUPABASE_QUESTION_TABLE).select().neq("image", null);
