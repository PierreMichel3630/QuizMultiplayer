import { compareTwoStrings } from "https://deno.land/x/string_similarity/mod.ts";

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
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  ).toLowerCase();

const removeStopWord = (value: string) =>
  value
    .toLowerCase()
    .replace(new RegExp("\\b(" + stopwords.join("|") + ")\\b", "g"), "")
    .replace(/\s/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");

const compareString = (a: string, b: string) =>
  compareTwoStrings(
    normalizeString(a.toLowerCase()),
    normalizeString(b.toString().toLowerCase())
  );

export const verifyResponse = (
  response: Array<string> | number,
  value: string
) => {
  let result = false;
  if (Array.isArray(response)) {
    result = response.reduce((acc: boolean, b: string) => {
      const val = compareString(b, value) >= LIMIT;
      return acc || val;
    }, false);
  } else {
    result = Number(response) === Number(value);
  }
  return result;
};
