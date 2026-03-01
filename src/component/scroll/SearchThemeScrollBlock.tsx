import { Alert, Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  searchThemesAndCategoriesPaginate,
  searchThemesPaginate,
} from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { CardImage, ICardImage } from "../card/CardImage";
import { CardSelectTheme } from "../card/CardTheme";
import { SkeletonThemesGrid } from "../skeleton/SkeletonTheme";
import { debounce } from "lodash";

interface Props {
  search: string;
}

export const SearchThemeScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const ITEM_PER_PAGE = 40;

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const getSearch = useCallback(
    (page: number, searchValue: string) => {
      if (language) {
        searchThemesAndCategoriesPaginate(
          language,
          searchValue,
          page,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          const result = data ?? [];
          setIsEnd(result.length < ITEM_PER_PAGE);
          setItemsSearch((prev) =>
            page === 0 ? [...result] : [...prev, ...result],
          );
          setLoading(false);
        });
      }
    },
    [language],
  );

  const debouncedFetch = useMemo(
    () => debounce((page: number, val: string) => getSearch(page, val), 500),
    [getSearch],
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    setLoading(true);
    setPage(0);
    setItemsSearch([]);
    setIsEnd(false);
    debouncedFetch(0, search);
  }, [debouncedFetch, search]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          debouncedFetch(prev + 1, search);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [itemsSearch, loading, isEnd, debouncedFetch, search]);

  return (
    <>
      {itemsSearch.length === 0 && isEnd ? (
        <Grid size={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <Grid size={12}>
          <Grid container spacing={1} justifyContent="center" sx={{ mb: 1 }}>
            {itemsSearch.map((item, index) => (
              <Grid
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
  avatars?: Array<{ id: number; avatars: Array<string> }>;
}

export const SearchThemeSelectScrollBlock = ({
  search,
  onSelect,
  avatars,
}: PropsSearchThemeSelectScrollBlock) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const ITEMPERPAGE = 40;

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const getSearch = useCallback(
    (page: number) => {
      if (loading) return;

      setLoading(true);
      if (language) {
        searchThemesPaginate(language, search, page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < ITEMPERPAGE);
            setItemsSearch((prev) =>
              page === 0 ? [...result] : [...prev, ...result],
            );
            setLoading(false);
          },
        );
      }
    },
    [search, loading, language],
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
        <Grid size={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <Grid size={12}>
          <Grid container spacing={1} justifyContent="center" sx={{ mb: 1 }}>
            {itemsSearch.map((item, index) => (
              <Grid
                key={index}
                ref={index === itemsSearch.length - 1 ? lastItemRef : null}
              >
                <CardSelectTheme
                  theme={item}
                  onSelect={() => onSelect(item)}
                  avatars={avatars}
                />
              </Grid>
            ))}
            {!isEnd && <SkeletonThemesGrid number={10} />}
          </Grid>
        </Grid>
      )}
    </>
  );
};
