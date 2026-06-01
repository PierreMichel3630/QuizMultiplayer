import { Language } from "src/models/Language";

export const shuffle = () => Math.random() - 0.5;

export const sortByRankAsc = (a: { rank: number }, b: { rank: number }) =>
  a.rank - b.rank;

export const sortByPriceDesc = (a: { price: number }, b: { price: number }) => {
  const valueA = a.price;
  const valueB = b.price;
  return valueA - valueB;
};

export const sortByIsaccomplishmentAndPriceDesc = (
  a: { isaccomplishment: boolean; price: number },
  b: { isaccomplishment: boolean; price: number },
) => {
  return (
    Number(a.isaccomplishment) - Number(b.isaccomplishment) || a.price - b.price
  );
};

export const sortByOrderAndName = (
  a: { name: string; order: number },
  b: { name: string; order: number },
) => a.order - b.order || a.name.localeCompare(b.name);

export const sortByLanguageName = (language: Language, a: any, b: any) =>
  a.name[language.iso].localeCompare(b.name[language.iso]);

export const sortByUsername = (
  a: { username: string },
  b: { username: string },
) => a.username.localeCompare(b.username);

export const sortByIds = (
  idsTheme: Array<number>,
  a: { id: number },
  b: { id: number },
) => idsTheme.indexOf(a.id) - idsTheme.indexOf(b.id);
