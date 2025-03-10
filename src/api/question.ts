import {
  QuestionInsert,
  QuestionInsertAdmin,
  QuestionThemeInsert,
  QuestionUpdate,
} from "src/models/Question";
import { supabase } from "./supabase";
import { FilterQuestion } from "src/pages/admin/AdminQuestionsPage";

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

export const selectQuestionThemeByQuestion = (question: number) =>
  supabase
    .from(SUPABASE_QUESTIONTHEME_TABLE)
    .select("*, theme(*)")
    .eq("question", question);

export const deleteQuestionThemeById = (id: number) =>
  supabase.from(SUPABASE_QUESTIONTHEME_TABLE).delete().eq("id", id);

export const selectQuestion = (
  page: number,
  itemperpage: number,
  filter: FilterQuestion
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  let query = supabase
    .from(SUPABASE_QUESTIONTHEME_TABLE)
    .select("*,question(*),theme(*)")
    .not("question", "is", null);
  if (filter.ids.length > 0) {
    query = query.in("question.id", filter.ids);
  }
  if (filter.themes.length > 0) {
    query = query.in("theme", filter.themes);
  }
  if (filter.isImage) {
    query = query.not("question.image", "is", null);
  }
  query = query.is("question.validate", filter.validate);
  query = query.order("question", { ascending: true }).range(from, to);
  return query;
};

export const insertQuestionAdmin = (value: QuestionInsertAdmin) =>
  supabase.from(SUPABASE_QUESTION_TABLE).insert(value).select().single();

export const insertQuestionTheme = (value: QuestionThemeInsert) =>
  supabase.from(SUPABASE_QUESTIONTHEME_TABLE).insert(value);

export const updateQuestion = (value: QuestionUpdate) =>
  supabase.from(SUPABASE_QUESTION_TABLE).update(value).eq("id", value.id);

export const deleteQuestionById = (id: number) =>
  supabase.from(SUPABASE_QUESTION_TABLE).delete().eq("id", id);

export const insertQuestion = (value: QuestionInsert) =>
  supabase.from(SUPABASE_QUESTION_TABLE).insert(value).select().single();

export const countQuestions = (filter: FilterQuestion) => {
  let query = supabase
    .from(SUPABASE_QUESTIONTHEME_TABLE)
    .select("*,question(*)", { count: "exact", head: true })
    .not("question", "is", null);

  if (filter.difficulties.length > 0) {
    query = query.in("question.difficulty", filter.difficulties);
  }
  if (filter.ids.length > 0) {
    query = query.in("question.id", filter.ids);
  }
  if (filter.themes.length > 0) {
    query = query.in("theme", filter.themes);
  }
  if (filter.isImage) {
    query = query.not("question.image", "is", null);
  }
  query = query.is("question.validate", filter.validate);
  return query;
};

export const countQuestionsAdmin = (filter: FilterQuestion) => {
  let query = supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select("*", { count: "exact", head: true });
  if (filter.ids.length > 0) {
    query = query.in("id", filter.ids);
  }
  if (filter.isImage) {
    query = query.not("image", "is", null);
  }
  query = query.is("validate", filter.validate);
  return query;
};

export const selectImageQuestion = (page: number, itemperpage = 1000) =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select("id, image")
    .not("image", "is", null)
    .order("id", { ascending: true })
    .range(page * itemperpage, (page + 1) * itemperpage);

export const countImageQuestion = () =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select("image", { count: "exact", head: true })
    .not("image", "is", null);
