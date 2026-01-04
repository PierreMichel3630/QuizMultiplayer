import { Box, Grid, Typography } from "@mui/material";
import { padding } from "csx";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const ITEMPERPAGE = 30;

  const [isLoading, setIsLoading] = useState(false);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const getThemes = useCallback(
    (page: number) => {
      if (isLoading) return;
      if (language && (page === 0 || !isEnd)) {
        setIsLoading(true);
        searchThemesPaginate(language, search, page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < ITEMPERPAGE);
            setItemsSearch((prev) =>
              page === 0 ? [...result] : [...prev, ...result]
            );
            setIsLoading(false);
          }
        );
      }
    },
    [isLoading, language, isEnd, search]
  );

  useEffect(() => {
    setPage(0);
    setItemsSearch([]);
    setIsEnd(false);
    getThemes(0);
  }, [search, language]);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getThemes(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [isLoading, isEnd, getThemes]);

  return (
    <Grid container spacing={1} justifyContent="center">
      {itemsSearch.map((item, index) => (
        <Grid
          key={index}
          ref={index === itemsSearch.length - 1 ? lastItemRef : null}
          onClick={() => onSelect(item)}
          size={12}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              p: padding(2, 15),
            }}
          >
            <ImageThemeBlock theme={item} size={40} />
            <Typography variant="h4">{item.name}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
