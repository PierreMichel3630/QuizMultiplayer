import { Alert, Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  searchThemesAndCategoriesPaginate,
  searchThemesPaginate,
} from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { CardImage, ICardImage } from "../card/CardImage";
import { CardSelectAvatarTheme, CardSelectTheme } from "../card/CardTheme";
import { SkeletonThemesGrid } from "../skeleton/SkeletonTheme";

interface Props {
  search: string;
}

export const SearchThemeScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const getSearch = useCallback(
    (page: number) => {
      if (loading) return;

      setLoading(true);
      const itemperpage = 40;
      if (language) {
        searchThemesAndCategoriesPaginate(
          language,
          search,
          page,
          itemperpage
        ).then(({ data }) => {
          const result = data ?? [];
          setIsEnd(result.length < itemperpage);
          setItemsSearch((prev) =>
            page === 0 ? [...result] : [...prev, ...result]
          );
          setLoading(false);
        });
      }
    },
    [search, loading, language]
  );

  useEffect(() => {
    setPage(0);
    setItemsSearch([]);
    setIsEnd(false);
    getSearch(0);
  }, [search]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getSearch(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [itemsSearch, loading, isEnd, getSearch]);

  return (
    <>
      {itemsSearch.length === 0 && isEnd ? (
        <Grid item xs={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Grid container spacing={1} justifyContent="center" sx={{ mb: 1 }}>
            {itemsSearch.map((item, index) => (
              <Grid
                item
                key={index}
                ref={index === itemsSearch.length - 1 ? lastItemRef : null}
              >
                <CardImage value={item} />
              </Grid>
            ))}
            {!isEnd && <SkeletonThemesGrid number={10} />}
          </Grid>
        </Grid>
      )}
    </>
  );
};

interface PropsSearchThemeSelectScrollBlock {
  search: string;
  onSelect: (value: ICardImage) => void;
}

export const SearchThemeSelectScrollBlock = ({
  search,
  onSelect,
}: PropsSearchThemeSelectScrollBlock) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const getSearch = useCallback(
    (page: number) => {
      if (loading) return;

      setLoading(true);
      const itemperpage = 40;
      if (language) {
        searchThemesPaginate(language, search, page, itemperpage).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < itemperpage);
            setItemsSearch((prev) =>
              page === 0 ? [...result] : [...prev, ...result]
            );
            setLoading(false);
          }
        );
      }
    },
    [search, loading, language]
  );

  useEffect(() => {
    setPage(0);
    setItemsSearch([]);
    setIsEnd(false);
    getSearch(0);
  }, [search]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getSearch(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [itemsSearch, loading, isEnd, getSearch]);

  return (
    <>
      {itemsSearch.length === 0 && isEnd ? (
        <Grid item xs={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Grid container spacing={1} justifyContent="center" sx={{ mb: 1 }}>
            {itemsSearch.map((item, index) => (
              <Grid
                item
                key={index}
                ref={index === itemsSearch.length - 1 ? lastItemRef : null}
              >
                <CardSelectTheme theme={item} onSelect={() => onSelect(item)} />
              </Grid>
            ))}
            {!isEnd && <SkeletonThemesGrid number={10} />}
          </Grid>
        </Grid>
      )}
    </>
  );
};

interface PropsSearchThemeSelectAvatarScrollBlock {
  search: string;
  onSelect: (value: ICardImage) => void;
  avatars: Array<{ id: number; avatars: Array<string> }>;
}

export const SearchThemeSelectAvatarScrollBlock = ({
  search,
  onSelect,
  avatars,
}: PropsSearchThemeSelectAvatarScrollBlock) => {
  const { t } = useTranslation();
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
            loader={<SkeletonThemesGrid number={10} />}
          >
            <Grid container spacing={1} justifyContent="center">
              {itemsSearch.map((item, index) => (
                <Grid item key={index}>
                  <CardSelectAvatarTheme
                    theme={item}
                    avatars={avatars}
                    onSelect={() => onSelect(item)}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </Grid>
      )}
    </>
  );
};
