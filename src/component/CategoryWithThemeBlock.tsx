import { useCallback, useEffect, useState } from "react";
import { countThemesByCategory, selectThemesByCategory } from "src/api/theme";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

interface Props {
  category: Category;
}
export const CategoryWithThemeBlock = ({ category }: Props) => {
  const { language } = useUser();
  const [themes, setThemes] = useState<Array<ICardImage>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<undefined | number>(undefined);
  const [, setPage] = useState(0);

  const getTheme = useCallback(
    (page: number) => {
      setIsLoading(true);
      selectThemesByCategory(category.id, "", page, 15, language.iso).then(
        ({ data }) => {
          const res = (data ?? []).map((el) => ({
            ...el,
            type: TypeCardEnum.THEME,
          }));
          setThemes((prev) => (page === 0 ? [...res] : [...prev, ...res]));
          setIsLoading(false);
        }
      );
    },
    [category.id, language.iso]
  );

  useEffect(() => {
    const getCount = () => {
      countThemesByCategory(category.id).then(({ count }) => {
        setCount(count ?? 0);
      });
    };
    getCount();
  }, [category, language]);

  useEffect(() => {
    getTheme(0);
  }, []);

  return (
    themes.length > 0 && (
      <CategoryBlock
        title={category.title}
        count={count}
        link={`/category/${category.id}`}
        values={themes}
        isLoading={isLoading}
        handleScroll={() =>
          setPage((prev) => {
            getTheme(prev + 1);
            return prev + 1;
          })
        }
      />
    )
  );
};
