import {
  QuestionAnswerInsert,
  QuestionInsert,
  QuestionInsertAdmin,
  QuestionThemeInsert,
  QuestionTranslationInsert,
  QuestionTranslationUpdate,
  QuestionUpdate,
} from "src/models/Question";
import { FilterQuestion } from "src/pages/admin/Edit/AdminEditQuestionsPage";
import { supabase } from "./supabase";

export const SUPABASE_QUESTION_TABLE = "question";
export const SUPABASE_QUESTIONTHEME_TABLE = "questiontheme";
export const SUPABASE_QUESTIONANSWER_TABLE = "questionanswer";
export const SUPABASE_QUESTIONTRANSLATION_TABLE = "questiontranslation";
export const SUPABASE_RANDOMQUESTION_TABLE = "randomquestion";
export const SUPABASE_COUNTQUESTION_TABLE = "viewquestionbythemeandlanguage";

export const countQuestionByTheme = (theme: number) =>
  supabase
    .from(SUPABASE_COUNTQUESTION_TABLE)
    .select("*, language(*)")
    .eq("theme", theme)
    .eq("language.activate", true)
    .not("language", "is", null);

export const selectQuestionWithImage = () =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select()
    .neq("image", null)
    .eq("theme", 5);

export const selectQuestionById = (id: number) =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select(
      "*, questiontranslation(*, language(*)), questionanswer(*, answer(*, answertranslation(*, language(*))))"
    )
    .eq("id", id)
    .maybeSingle();

export const selectQuestionThemeByQuestion = (question: number) =>
  supabase
    .from(SUPABASE_QUESTIONTHEME_TABLE)
    .select(
      "*, theme(id, color,image ,themetranslation!inner(name, language(*)))"
    )
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
    .from(SUPABASE_QUESTION_TABLE)
    .select(
      "*, questiontranslation(*, language(*)), questionanswer(*, answer(*, answertranslation(*, language(*)))), questiontheme!inner(*, theme(id, color,image ,themetranslation!inner(name, language(*))))"
    );
  if (filter.ids.length > 0) {
    query = query.in("id", filter.ids);
  }
  if (filter.theme) {
    query = query
      .eq("questiontheme.theme.id", filter.theme)
      .not("questiontheme.theme", "is", null);
  }
  query = query
    .not("image", "is", null)
    .order("id", { ascending: true })
    .range(from, to);
  return query;
};

export const insertQuestionAdmin = (value: QuestionInsertAdmin) =>
  supabase.from(SUPABASE_QUESTION_TABLE).insert(value).select().single();

export const insertQuestionTheme = (value: QuestionThemeInsert) =>
  supabase.from(SUPABASE_QUESTIONTHEME_TABLE).insert(value);

export const deleteQuestionTheme = (question: number, theme: number) =>
  supabase
    .from(SUPABASE_QUESTIONTHEME_TABLE)
    .delete()
    .eq("question", question)
    .eq("theme", theme);

export const insertQuestionAnswer = (value: QuestionAnswerInsert) =>
  supabase.from(SUPABASE_QUESTIONANSWER_TABLE).insert(value);

export const insertQuestionTranslations = (
  values: Array<QuestionTranslationInsert>
) => supabase.from(SUPABASE_QUESTIONTRANSLATION_TABLE).insert(values);

export const deleteQuestionTranslationByIds = (ids: Array<number>) =>
  supabase.from(SUPABASE_QUESTIONTRANSLATION_TABLE).delete().in("id", ids);

export const updateQuestionTranslation = (
  values: Array<QuestionTranslationUpdate>
) => supabase.from(SUPABASE_QUESTIONTRANSLATION_TABLE).upsert(values);

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

  if (filter.ids.length > 0) {
    query = query.in("question.id", filter.ids);
  }
  if (filter.theme) {
    query = query.eq("theme", filter.theme);
  }
  return query.not("question.image", "is", null);
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

export const selectQuestionsPropose = () =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select(
      "*, questiontranslation(*, language(*)), questionanswer(*, answer(*, answertranslation(*, language(*)))), questiontheme(*, theme(id, color,image ,themetranslation!inner(name, language(*))))"
    )
    .eq("validate", false);

export const selectQuestionsProposeBy = (uuid: string) =>
  supabase
    .from(SUPABASE_QUESTION_TABLE)
    .select(
      "*, questiontranslation(*, language(*)), questionanswer(*, answer(*, answertranslation(*, language(*)))), questiontheme(*, theme(id, color,image ,themetranslation!inner(name, language(*))))"
    )
    .eq("proposeby", uuid);
