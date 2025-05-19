import { useEffect, useMemo, useState } from "react";
import { selectThemesByCategory } from "src/api/theme";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";
import { CategoryBlock } from "./category/CategoryBlock";

interface Props {
  category: Category;
}
export const CategoryWithThemeBlock = ({ category }: Props) => {
  const { language } = useUser();
  const [themes, setThemes] = useState<Array<Theme>>([]);

  useEffect(() => {
    const getTheme = () => {
      selectThemesByCategory(category.id, language.iso).then(({ data }) => {
        setThemes(data ?? []);
      });
    };
    getTheme();
  }, [category, language]);

  const themesOrder = useMemo(
    () => [
      ...themes.filter((el) => el.isfirst),
      ...themes.filter((el) => !el.isfirst),
    ],
    [themes]
  );

  const values = useMemo(
    () =>
      themesOrder.map((el) => ({
        id: el.id,
        name: el.name,
        image: el.image,
        color: el.color,
        link: `/theme/${el.id}`,
        type: TypeCardEnum.THEME,
      })),
    [themesOrder]
  );

  return (
    themes.length > 0 && (
      <CategoryBlock
        title={category.name}
        count={themes.length}
        link={`/category/${category.id}`}
        values={values}
      />
    )
  );
};
