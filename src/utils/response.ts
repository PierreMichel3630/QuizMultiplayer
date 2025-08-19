import { Answer } from "src/component/question/ResponseBlock";
import { Question, QuestionResult } from "src/models/Question";
import { compareTwoStrings } from "string-similarity";
import { decryptToNumber } from "./crypt";
import { Language } from "src/models/Language";

const LIMIT = 0.7;
const stopwords = [
  "the",
  "of",
  "le",
  "la",
  "l'",
  "de",
  "des",
  "du",
  "un",
  "une",
  "ce",
  "se",
  "et",
  "and",
];

const normalizeString = (value: string) =>
  removeStopWord(
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  ).toLowerCase();

const removeStopWord = (value: string) =>
  value
    .toLowerCase()
    .replace(new RegExp("\\b(" + stopwords.join("|") + ")\\b", "g"), "")
    .replace(/\s/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");

const compareString = (a: string, b: string) =>
  compareTwoStrings(normalizeString(a), normalizeString(b));

export const verifyResponseCrypt = (
  question: Question,
  language: Language,
  answer: Answer
) => {
  let result = false;
  const myResponseValue = answer.value;
  const decryptResponse = decryptToNumber(question.answer);
  if (decryptResponse !== undefined) {
    if (question.isqcm) {
      result = Number(myResponseValue) === Number(decryptResponse);
    } else {
      const answer = [...question.answers].find(
        (el) => el.id === decryptResponse
      );
      if (answer) {
        const answertranslation = [...answer.answertranslation].find(
          (el) => el.language.id === language.id
        );
        if (answertranslation) {
          const answers = [
            answertranslation.label.toString(),
            ...answertranslation.otherlabel.map((el) => el.toString()),
          ];
          result = checkResponse(answers, myResponseValue);
        }
      }
    }
  }
  return result;
};

export const getResponse = (question: Question, language: Language) => {
  let result: string | number = "";
  const decryptResponse = decryptToNumber(question.answer);
  if (result !== undefined) {
    if (question.isqcm) {
      result = decryptResponse;
    } else {
      const answer = [...question.answers].find(
        (el) => el.id === decryptResponse
      );
      if (answer) {
        const answertranslation = [...answer.answertranslation].find(
          (el) => el.language.id === language.id
        );
        if (answertranslation) {
          result = answertranslation.label;
        }
      }
    }
  }
  return result;
};

export const verifyResponse = (question: QuestionResult, answer: Answer) => {
  let result = false;
  const myResponseValue = answer.value;
  const decryptResponse = question.response;
  if (decryptResponse !== undefined) {
    result = Number(myResponseValue) === Number(decryptResponse);
  }
  return result;
};

const checkResponse = (
  response: Array<string> | number,
  value?: string | number
) => {
  const limit = LIMIT;
  let result = false;
  if (value !== undefined) {
    if (Array.isArray(response)) {
      result = response.reduce((acc: boolean, b: string) => {
        const val = compareString(b, value.toString()) >= limit;
        return acc || val;
      }, false);
    } else {
      result = Number(response) === Number(value);
    }
  }
  return result;
};
