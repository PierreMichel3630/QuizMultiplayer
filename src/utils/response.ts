import { compareTwoStrings } from "string-similarity";

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

export const verifyResponse = (
  response: Array<string> | string | number,
  value: string | number,
  exact: boolean
) => {
  const limit = exact ? LIMITEXACT : LIMIT;
  let result = false;
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
  return result;
};
