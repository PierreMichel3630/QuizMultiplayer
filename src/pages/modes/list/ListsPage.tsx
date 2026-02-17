import { Box, Grid } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { searchListPaginate } from "src/api/list";
import { CardList } from "src/component/card/CardList";
import { TitleBlock } from "src/component/title/Title";
import { useUser } from "src/context/UserProvider";
import { ListTranslation } from "src/models/List";

export default function ListsPage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const ITEM_PER_PAGE = 50;
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ListTranslation>>([]);

  const getList = useCallback(
    (page: number) => {
      if (page === 0) {
        window.scrollTo(0, 0);
      }
      if (loading) return;
      if (language) {
        searchListPaginate(language, "", page, ITEM_PER_PAGE).then(
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
    [language, loading],
  );

  useEffect(() => {
    setPage(0);
    setItemsSearch([]);
    setIsEnd(false);
    getList(0);
  }, [language]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getList(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [itemsSearch, loading, isEnd, getList]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.lists.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <TitleBlock title={t("pages.lists.title")} />
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
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
