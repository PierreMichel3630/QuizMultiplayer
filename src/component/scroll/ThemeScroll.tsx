import { Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { searchThemesPaginate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "../card/CardImage";
import { ImageThemeBlock } from "../ImageThemeBlock";

interface PropsThemeListScrollBlock {
  search: string;
  onSelect: (value: ICardImage) => void;
}

export const ThemeListScrollBlock = ({
  search,
  onSelect,
}: PropsThemeListScrollBlock) => {
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const getThemes = useCallback(
    (page: number) => {
      const itemperpage = 30;
      if (!isEnd && language) {
        searchThemesPaginate(language, search, page, itemperpage).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < itemperpage);
            setItemsSearch((prev) => [...prev, ...result]);
          }
        );
      }
    },
    [isEnd, search, language]
  );

  useEffect(() => {
    setPage(0);
    setIsEnd(false);
    setItemsSearch([]);
  }, [search, language]);

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getThemes(nextPage);
      return nextPage;
    });
  };

  useEffect(() => {
    getThemes(0);
  }, [getThemes]);

  return (
    <InfiniteScroll
      dataLength={itemsSearch.length}
      next={handleLoadMoreData}
      hasMore={!isEnd}
      loader={undefined}
    >
      <Grid container spacing={1} justifyContent="center">
        {itemsSearch.map((item, index) => (
          <Grid item key={index} onClick={() => onSelect(item)}>
            <ImageThemeBlock theme={item} size={50} />
            <Typography>{item.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};
