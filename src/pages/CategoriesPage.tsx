import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { search } from "src/api/search";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { SearchResult } from "src/models/Search";

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const ITEMPERPAGE = 50;

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<undefined | number>(undefined);
  const [, setPage] = useState(0);

  const getItemsSearch = useCallback(
    (page: number) => {
      setIsLoading(true);
      if (language) {
        search(language, "", page, ITEMPERPAGE, SearchType.CATEGORY).then(({ data }) => {
          if (data !== null) {
            const res: SearchResult<ICardImage> = data;
            setItemsSearch((prev) =>
              page === 0 ? [...res.elements] : [...prev, ...res.elements],
            );
            setCount(res.total_count);
          }
          setIsLoading(false);
        });
      }
    },
    [language],
  );

  useEffect(() => {
    getItemsSearch(0);
  }, [language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.categories.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.categories.title")}
          values={itemsSearch}
          isLoading={isLoading}
          count={count}
          handleScroll={() =>
            setPage((prev) => {
              getItemsSearch(prev + 1);
              return prev + 1;
            })
          }
        />
      </Grid>
    </Grid>
  );
}
