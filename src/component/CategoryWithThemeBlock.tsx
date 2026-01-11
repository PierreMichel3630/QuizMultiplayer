import { useCallback, useEffect, useState } from "react";
import { countThemesByCategory, selectThemesByCategory } from "src/api/theme";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";

interface Props {
  category: {
    id: number;
    name: string;
  };
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
      if (language) {
        selectThemesByCategory(language, category.id, "", page, 15).then(
          ({ data }) => {
            const res = (data ?? []).map((el) => ({
              ...el,
              type: SearchType.THEME,
            }));
            setThemes((prev) => (page === 0 ? [...res] : [...prev, ...res]));
            setIsLoading(false);
          }
        );
      }
    },
    [category.id, language]
  );

  useEffect(() => {
    const getCount = () => {
      if (language) {
        countThemesByCategory(category.id, language).then(({ count }) => {
          setCount(count ?? 0);
        });
      }
    };
    getCount();
  }, [category, language]);

  useEffect(() => {
    getTheme(0);
  }, []);

  return (
    themes.length > 0 && (
      <CategoryBlock
        title={category.name}
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
