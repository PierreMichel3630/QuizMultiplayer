import { Box, Grid, Typography, useTheme } from "@mui/material";
import { padding, percent } from "csx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchThemesTranslation } from "src/api/theme";
import { useUser } from "src/context/UserProvider";
import { ThemeTranslationWithTheme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface PropsThemeListScrollBlock {
  search: string;
  onSelect: (value: ThemeTranslationWithTheme) => void;
}

export const ThemeListScrollBlock = ({
  search,
  onSelect,
}: PropsThemeListScrollBlock) => {
  const { language } = useUser();
  const theme = useTheme();
  const isDark = useMemo(() => theme.palette.mode === "dark", [theme]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const ITEMPERPAGE = 30;

  const [isLoading, setIsLoading] = useState(false);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<
    Array<ThemeTranslationWithTheme>
  >([]);

  const getThemes = useCallback(
    (page: number) => {
      if (isLoading) return;
      if (language && (page === 0 || !isEnd)) {
        setIsLoading(true);
        searchThemesTranslation(language, search, page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < ITEMPERPAGE);
            setItemsSearch((prev) =>
              page === 0 ? [...result] : [...prev, ...result],
            );
            setIsLoading(false);
          },
        );
      }
    },
    [isLoading, language, isEnd, search],
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
    <Grid container justifyContent="center" sx={{ width: percent(100) }}>
      {itemsSearch.map((item, index) => (
        <Grid
          key={index}
          ref={index === itemsSearch.length - 1 ? lastItemRef : null}
          onClick={() => onSelect(item)}
          size={12}
          sx={{
            p: padding(2, 5),
            cursor: "pointer",
            "&:hover": {
              backgroundColor: isDark
                ? theme.palette.grey[700]
                : theme.palette.grey[400],
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              p: padding(2, 15),
            }}
          >
            <ImageThemeBlock theme={item.theme} size={40} />
            <Typography variant="h4" sx={{ flex: 1 }}>
              {item.name}
            </Typography>
            <StatusTheme
              enabled={item.theme.enabled}
              validate={item.theme.validate}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsStatusTheme {
  enabled: boolean;
  validate: boolean;
}
const StatusTheme = ({ validate, enabled }: PropsStatusTheme) => {
  const { t } = useTranslation();

  const isValide = useMemo(() => validate && enabled, [validate, enabled]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: isValide ? Colors.green : Colors.red,
      }}
    >
      {isValide ? (
        <>
          <CheckIcon />
          <Typography variant="h6">{t("commun.enabled")}</Typography>
        </>
      ) : (
        <>
          <ClearIcon />
          <Typography variant="h6">
            {enabled ? t("commun.notvalidate") : t("commun.notenabled")}
          </Typography>
        </>
      )}
    </Box>
  );
};
