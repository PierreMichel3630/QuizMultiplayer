import {
  QuestionInsert,
  QuestionInsertAdmin,
  QuestionThemeInsert,
  QuestionUpdate,
} from "src/models/Question";
import { supabase } from "./supabase";

export const SUPABASE_QUESTION_TABLE = "question";
export const SUPABASE_QUESTIONTHEME_TABLE = "questiontheme";
export const SUPABASE_RANDOMQUESTION_TABLE = "randomquestion";

export const selectQuestionWithImage = () =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select()
    .neq("image", null)
    .eq("theme", 5);

export const selectQuestionById = (id: number) =>
  supabase.from(SUPABASE_QUESTION_TABLE).select().eq("id", id).maybeSingle();

export const selectQuestion = (
  page: number,
  itemperpage: number,
  questionsId: string,
  isImage: boolean
) =>
  questionsId !== ""
    ? supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select()
        .in("id", questionsId.split(","))
        .order("id", { ascending: true })
        .range(page * itemperpage, (page + 1) * itemperpage)
    : isImage
    ? supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select()
        .not("image", "is", null)
        .order("id", { ascending: true })
        .range(page * itemperpage, (page + 1) * itemperpage)
    : supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select()
        .order("id", { ascending: true })
        .range(page * itemperpage, (page + 1) * itemperpage);

export const insertQuestionAdmin = (value: QuestionInsertAdmin) =>
  supabase.from(SUPABASE_QUESTION_TABLE).insert(value).select().single();

export const insertQuestionTheme = (value: QuestionThemeInsert) =>
  supabase.from(SUPABASE_QUESTIONTHEME_TABLE).insert(value);

export const updateQuestion = (value: QuestionUpdate) =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const deleteQuestionById = (id: number) =>
  supabase.from(SUPABASE_QUESTION_TABLE).delete().eq("id", id);

export const insertQuestion = (value: QuestionInsert) =>
  supabase.from(SUPABASE_QUESTION_TABLE).insert(value).select().single();

export const countQuestions = (questionsId: string) =>
  questionsId !== ""
    ? supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select("*", { count: "exact", head: true })
        .in("id", questionsId.split(","))
    : supabase
        .from(SUPABASE_QUESTION_TABLE)
        .select("*", { count: "exact", head: true });
