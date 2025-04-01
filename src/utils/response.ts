import { Answer } from "src/component/question/ResponseBlock";
import { Language } from "src/models/Language";
import { ResponseLanguage } from "src/models/Response";
import { compareTwoStrings } from "string-similarity";
import { decrypt } from "./crypt";

const LIMIT = 0.7;
const LIMITEXACT = 1;
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

interface QuestionProps {
  response: string;
  exact: boolean;
  isqcm: boolean;
}
export const verifyResponse = (
  language: Language,
  question: QuestionProps,
  answer: Answer
) => {
  let result = false;
  const myResponseValue = answer.value;
  const decryptResponse = decrypt(question.response);
  if (decryptResponse !== undefined) {
    if (question.isqcm) {
      result = Number(myResponseValue) === Number(decryptResponse);
    } else {
      const response = JSON.parse(
        decryptResponse.toString()
      ) as ResponseLanguage;
      result = checkResponse(
        response[language.iso],
        question.exact ?? answer.exact,
        myResponseValue
      );
    }
  }
  return result;
};

const checkResponse = (
  response: Array<string> | string | number,
  exact: boolean,
  value?: string | number
) => {
  const limit = exact ? LIMITEXACT : LIMIT;
  let result = false;
  if (value !== undefined) {
    if (Array.isArray(response)) {
      result = response.reduce((acc: boolean, b: string) => {
        const val = compareString(b, value.toString()) >= limit;
        return acc || val;
      }, false);
    } else if (typeof response === "string") {
      result = compareString(response, value.toString()) >= limit;
    } else {
      result = Number(response) === Number(value);
    }
  }
  return result;
};
