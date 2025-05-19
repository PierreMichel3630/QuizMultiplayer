import { Alert, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { searchThemesAndCategories } from "src/api/search";
import { CardImage, ICardImage } from "../card/CardImage";
import { SkeletonThemesGrid } from "../skeleton/SkeletonTheme";
import { useUser } from "src/context/UserProvider";

interface Props {
  search: string;
}

export const SearchThemeScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const getCategories = useCallback(
    (page: number) => {
      const itemperpage = 5;
      if (!isEnd) {
        searchThemesAndCategories(search, page, itemperpage).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < itemperpage);
            setItemsSearch((prev) => [...prev, ...result]);
          }
        );
      }
    },
    [isEnd, search]
  );

  useEffect(() => {
    setPage(0);
    setIsEnd(false);
    setItemsSearch([]);
  }, [search, language]);

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getCategories(nextPage);
      return nextPage;
    });
  };

  useEffect(() => {
    getCategories(0);
  }, [getCategories]);

  return (
    <>
      {itemsSearch.length === 0 && isEnd ? (
        <Grid item xs={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <InfiniteScroll
            dataLength={itemsSearch.length}
            next={handleLoadMoreData}
            hasMore={!isEnd}
            loader={<SkeletonThemesGrid number={15} />}
          >
            <Grid container spacing={1} justifyContent="center" sx={{ mb: 1 }}>
              {itemsSearch.map((item, index) => (
                <Grid item key={index}>
                  <CardImage value={item} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>{" "}
        </Grid>
      )}
    </>
  );
};
