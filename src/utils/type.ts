export const isStringOrNumber = (value: unknown) =>
  isString(value) || isNumber(value);
const isString = (value: unknown) => typeof value === "string";
const isNumber = (value: unknown) => typeof value === "number";
