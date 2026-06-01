import { compareTwoStrings } from "string-similarity";

const stopwords = [
  "the",
  "of",
  "le",
  "la",
  "l'",
  "de",
  "des",
  "un",
  "une",
  "ce",
  "se",
  "et",
  "and",
];
const normalizeString = (value: string) =>
  removeStopWord(
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
  ).toLowerCase();

const removeStopWord = (value: string) =>
  value
    .toLowerCase()
    .replace(new RegExp("\\b(" + stopwords.join("|") + ")\\b", "g"), "")
    .replace(/\s/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");

export const compareString = (a: string, b: string) =>
  compareTwoStrings(
    normalizeString(a.toLowerCase()),
    normalizeString(b.toString().toLowerCase()),
  );

export const searchString = (search: string, value: string) => {
  const valueNormalize = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const searchNormalize = search
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const compare = compareTwoStrings(valueNormalize, searchNormalize);
  const isInclude = valueNormalize.includes(searchNormalize);
  return isInclude || compare > 0.6;
};

export const removeAccentsAndLowercase = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
