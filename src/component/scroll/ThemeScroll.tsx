import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { searchThemesPaginate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "../card/CardImage";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { CardAdminTheme } from "../card/CardTheme";
import { searchThemes } from "src/api/theme";
import { Theme } from "src/models/Theme";

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
      if (!isEnd) {
        searchThemesPaginate(search, page, itemperpage).then(({ data }) => {
          const result = data ?? [];
          setIsEnd(result.length < itemperpage);
          setItemsSearch((prev) => [...prev, ...result]);
        });
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
            <JsonLanguageBlock value={item.name} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};

interface PropsThemeAdminListScrollBlock {
  search: string;
  onSelect: (value: Theme) => void;
}

export const ThemeAdminListScrollBlock = ({
  search,
  onSelect,
}: PropsThemeAdminListScrollBlock) => {
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getThemes = useCallback(
    (page: number) => {
      const itemperpage = 30;
      if (!isEnd) {
        searchThemes(search, page, itemperpage).then(({ data }) => {
          const result = data ?? [];
          setIsEnd(result.length < itemperpage);
          setThemes((prev) => [...prev, ...result]);
        });
      }
    },
    [isEnd, search]
  );

  useEffect(() => {
    setPage(0);
    setIsEnd(false);
    setThemes([]);
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
      dataLength={themes.length}
      next={handleLoadMoreData}
      hasMore={!isEnd}
      loader={undefined}
    >
      <Grid container spacing={1} justifyContent="center">
        {themes.map((item, index) => (
          <Grid item xs={12} key={index} onClick={() => onSelect(item)}>
            <CardAdminTheme
              theme={item}
              onChange={() => {
                setPage(0);
                setIsEnd(false);
                setThemes([]);
                getThemes(0);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};
