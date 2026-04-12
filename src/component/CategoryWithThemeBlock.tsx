import { useCallback, useEffect, useState } from "react";
import { selectItemsByCategory } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { SearchResult } from "src/models/Search";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";

interface Props {
  category: {
    id: number | string;
    name: string;
  };
}
export const CategoryWithThemeBlock = ({ category }: Props) => {
  const { language } = useUser();
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<undefined | number>(undefined);
  const [, setPage] = useState(0);

  const getItemsSearch = useCallback(
    (page: number) => {
      setIsLoading(true);
      if (language) {
        selectItemsByCategory(language, category.id, "", page, 15).then(
          ({ data }) => {
            if (data !== null) {
              const res: SearchResult<ICardImage> = data;
              setItemsSearch((prev) =>
                page === 0 ? [...res.elements] : [...prev, ...res.elements],
              );
              setCount(res.total_count);
            }
            setIsLoading(false);
          },
        );
      }
    },
    [category.id, language],
  );

  useEffect(() => {
    getItemsSearch(0);
  }, []);

  return (
    itemsSearch.length > 0 && (
      <CategoryBlock
        title={category.name}
        count={count}
        link={`/category/${category.id}`}
        values={itemsSearch}
        isLoading={isLoading}
        handleScroll={() =>
          setPage((prev) => {
            getItemsSearch(prev + 1);
            return prev + 1;
          })
        }
      />
    )
  );
};
