import {
  AnswerInsert,
  AnswerSetInsert,
  AnswerTranslationInsert,
  AnswerTranslationUpdate,
  AnswerUpdate,
} from "src/models/Answer";
import { Language } from "src/models/Language";
import { QuestionAdmin } from "src/models/Question";
import { supabase } from "./supabase";

export const SUPABASE_ANSWERTRANSLATION_TABLE = "answertranslation";
export const SUPABASE_ANSWERSET_TABLE = "answerset";
export const SUPABASE_ANSWER_TABLE = "answer";

export const searchAnswerByLanguageAndSet = (
  answerset: number,
  language: Language,
  search: string,
  notAnswer?: Array<number>
) => {
  let query = supabase
    .from(SUPABASE_ANSWERTRANSLATION_TABLE)
    .select("*, answer!inner(*)")
    .eq("language", language.id)
    .eq("answer.answerset", answerset)
    .ilike("label", `%${search}%`);
  if (notAnswer) {
    query = query.not("answer.id", "in", `(${notAnswer.join(",")})`);
  }
  return query.order("label");
};

export const selectAnswerTranslationById = (id: number) =>
  supabase
    .from(SUPABASE_ANSWERTRANSLATION_TABLE)
    .select("*, answer!inner(*)")
    .eq("id", id)
    .maybeSingle();

export const selectAnswerById = (id: number) =>
  supabase
    .from(SUPABASE_ANSWER_TABLE)
    .select("*, answertranslation(*, language(*))")
    .eq("id", id)
    .maybeSingle();

export const selectAnswerByAnswerset = (
  answerset: number,
  notIds?: Array<number>
) => {
  let query = supabase
    .from(SUPABASE_ANSWER_TABLE)
    .select("*, answertranslation(*, language(*))")
    .eq("answerset", answerset);
  if (notIds) {
    query = query.not("id", "in", `(${notIds.join(",")})`);
  }
  return query;
};

export const deleteAnswerById = (id: number) =>
  supabase.from(SUPABASE_ANSWER_TABLE).delete().eq("id", id);

export const updateAnswer = (value: AnswerUpdate) =>
  supabase.from(SUPABASE_ANSWER_TABLE).update(value).eq("id", value.id);

export const insertAnswers = (values: Array<AnswerInsert>) =>
  supabase.from(SUPABASE_ANSWER_TABLE).insert(values).select();

export const insertAnswerSet = (value: AnswerSetInsert) =>
  supabase.from(SUPABASE_ANSWERSET_TABLE).insert(value).select().maybeSingle();

export const insertAnswerTranslations = (
  values: Array<AnswerTranslationInsert>
) => supabase.from(SUPABASE_ANSWERTRANSLATION_TABLE).insert(values).select();

export const getWrongAnswer = (question: QuestionAdmin) => {
  const answerset =
    question.answerset ?? question.questionanswer[0].answer.answerset;
  const idsAnswers = [...question.questionanswer].map((el) => el.answer.id);
  return supabase
    .from(SUPABASE_ANSWER_TABLE)
    .select("*, answertranslation(*, language(*))")
    .eq("answerset", answerset)
    .not("id", "in", `(${idsAnswers.join(",")})`)
    .limit(3);
};

export const getAnswerTranslation = (question: QuestionAdmin) => {
  const answerset =
    question.answerset ?? question.questionanswer[0].answer.answerset;
  return supabase
    .from(SUPABASE_ANSWERTRANSLATION_TABLE)
    .select("*, answertranslation(*)")
    .eq("answerset", answerset);
};

export const insertAnswerTranslation = (
  values: Array<AnswerTranslationInsert>
) => supabase.from(SUPABASE_ANSWERTRANSLATION_TABLE).insert(values);

export const deleteAnswerTranslationByIds = (ids: Array<number>) =>
  supabase.from(SUPABASE_ANSWERTRANSLATION_TABLE).delete().in("id", ids);

export const updateAnswerTranslation = (
  values: Array<AnswerTranslationUpdate>
) => supabase.from(SUPABASE_ANSWERTRANSLATION_TABLE).upsert(values);
