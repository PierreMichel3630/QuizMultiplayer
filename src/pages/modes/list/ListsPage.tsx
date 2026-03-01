import { Box, Grid } from "@mui/system";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { searchListPaginate } from "src/api/list";
import { CardList } from "src/component/card/CardList";
import { BasicSearchInput } from "src/component/Input";
import { SkeletonRectangulars } from "src/component/skeleton/SkeletonRectangular";
import { TitleBlock } from "src/component/title/Title";
import { useUser } from "src/context/UserProvider";
import { ListTranslation } from "src/models/List";

export default function ListsPage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const ITEM_PER_PAGE = 50;
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ListTranslation>>([]);

  const getList = useCallback(
    (page: number, searchValue: string) => {
      if (page === 0) {
        window.scrollTo(0, 0);
      }
      if (language) {
        searchListPaginate(language, searchValue, page, ITEM_PER_PAGE).then(
          ({ data }) => {
            const res = data ?? [];
            setItemsSearch((prev) =>
              page === 0 ? [...res] : [...prev, ...res],
            );
            setIsEnd(res.length < ITEM_PER_PAGE);
            setLoading(false);
          },
        );
      }
    },
    [language],
  );

  const debouncedFetch = useMemo(
    () => debounce((page: number, val: string) => getList(page, val), 500),
    [getList],
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    setPage(0);
    setItemsSearch([]);
    setIsEnd(false);
    debouncedFetch(0, search);
  }, [debouncedFetch, language, search]);

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
    <Grid container>
      <Helmet>
        <title>{`${t("pages.lists.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <TitleBlock title={t("pages.lists.title")} link="/" />
            </Grid>
            <Grid size={12}>
              <BasicSearchInput
                label={t("commun.search")}
                onChange={(value) => setSearch(value)}
                value={search}
                clear={() => setSearch("")}
              />
            </Grid>
            {itemsSearch.map((el, index) => (
              <Grid
                size={12}
                key={el.id}
                ref={index === itemsSearch.length - 1 ? lastItemRef : null}
              >
                <CardList value={el} />
              </Grid>
            ))}
            {!isEnd && <SkeletonRectangulars number={8} height={40} />}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
