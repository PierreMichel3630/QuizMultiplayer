import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { CategoryWithThemes } from "src/models/Category";
import { sortByName } from "src/utils/sort";
import { CategoryBlock } from "./category/CategoryBlock";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

interface Props {
  category: CategoryWithThemes;
}
export const CategoryWithThemeBlock = ({ category }: Props) => {
  const { language } = useUser();

  const themesCategory = useMemo(
    () => category.themes.sort((a, b) => sortByName(language, a, b)),
    [category, language]
  );

  const themes = useMemo(
    () => [
      ...themesCategory.filter((el) => el.isfirst),
      ...themesCategory.filter((el) => !el.isfirst),
    ],
    [themesCategory]
  );

  const values = useMemo(
    () =>
      themes.map((el) => ({
        id: el.id,
        name: el.name,
        image: el.image,
        color: el.color,
        link: `/theme/${el.id}`,
        type: TypeCardEnum.THEME,
      })),
    [themes]
  );

  return (
    <CategoryBlock
      title={category.name}
      count={themes.length}
      link={`/category/${category.id}`}
      values={values}
    />
  );
};
