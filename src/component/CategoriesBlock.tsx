import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "./category/CategoryBlock";

import { search } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { SearchResult } from "src/models/Search";
import { ICardImage } from "./card/CardImage";

export const CategoriesBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();

  const ITEMPERPAGE = 25;

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<undefined | number>(undefined);
  const [, setPage] = useState(0);

  const getItemsSearch = useCallback(
    (page: number) => {
      setIsLoading(true);
      if (language) {
        search(language, "", page, ITEMPERPAGE, SearchType.CATEGORY).then(
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
    [language],
  );

  useEffect(() => {
    getItemsSearch(0);
  }, [getItemsSearch]);

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        {itemsSearch.length > 0 && (
          <CategoryBlock
            title={t("commun.categories")}
            count={count}
            link={`/categories`}
            values={itemsSearch}
            isLoading={isLoading}
            handleScroll={() =>
              setPage((prev) => {
                getItemsSearch(prev + 1);
                return prev + 1;
              })
            }
          />
        )}
      </Grid>
    </Grid>
  );
};
