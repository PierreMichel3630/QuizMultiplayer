export const isStringOrNumber = (value: unknown) =>
  isString(value) || isNumber(value);
export const isString = (value: unknown) => typeof value === "string";
export const isNumber = (value: unknown) => typeof value === "number";
