import { QuestionInsert, QuestionUpdate } from "src/models/Question";
import { supabase } from "./supabase";

export const SUPABASE_QUESTION_TABLE = "question";

export const selectQuestionWithImage = () =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select()
    .neq("image", null)
    .eq("theme", 5);

export const selectQuestionById = (id: number) =>
  supabase.from(SUPABASE_QUESTION_TABLE).select().eq("id", id).maybeSingle();

export const selectQuestionByThemesAndDifficulty = (
  themes: Array<number>,
  page: number,
  itemperpage: number,
  difficulty?: string
) =>
  difficulty
    ? supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select()
        .in("theme", themes)
        .eq("difficulty", difficulty)
        .order("id", { ascending: true })
        .range(page * itemperpage, (page + 1) * itemperpage)
    : supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select()
        .in("theme", themes)
        .order("id", { ascending: true })
        .range(page * itemperpage, (page + 1) * itemperpage);

export const countQuestionByThemeAndDifficulty = (
  theme: number,
  difficulty?: string
) =>
  difficulty
    ? supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("difficulty", difficulty)
        .eq("theme", theme)
    : supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", theme);

export const insertQuestion = (value: QuestionInsert) =>
  supabase.from(SUPABASE_QUESTION_TABLE).insert(value).select().single();

export const updateQuestion = (value: QuestionUpdate) =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const deleteQuestionById = (id: number) =>
  supabase.from(SUPABASE_QUESTION_TABLE).delete().eq("id", id);
