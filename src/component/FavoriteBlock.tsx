import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";
import {
  CardSelectAvatarTheme,
  CardSelectTheme,
  CardTheme,
} from "./card/CardTheme";
import { Theme } from "src/models/Theme";
import { SkeletonThemes } from "./skeleton/SkeletonTheme";
import { useBreakpoint } from "src/utils/mediaQuery";

interface Props {
  search?: string;
  category?: Category;
}
export const FavoriteBlock = ({ search, category }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { themes, favorites } = useApp();
  const breakpoint = useBreakpoint();

  const ref = useRef<HTMLDivElement | null>(null);
  const [maxIndex, setMaxIndex] = useState(5);

  useEffect(() => {
    const indexSize = {
      xl: 15,
      lg: 15,
      md: 10,
      sm: 8,
      xs: 5,
    };
    setMaxIndex(indexSize[breakpoint]);
  }, [breakpoint]);

  const themesFavorite = useMemo(() => {
    const idFavorite = favorites.map((el) => el.theme);
    const themeFilter = themes.filter((el) =>
      category
        ? idFavorite.includes(el.id) && el.category.id === category.id
        : idFavorite.includes(el.id)
    );
    const themeUniq = uniqBy(themeFilter, (el) => el.id);
    return search
      ? themeUniq
          .filter((el) => searchString(search, el.name[language.iso]))
          .sort((a, b) => sortByName(language, a, b))
      : themeUniq.sort((a, b) => sortByName(language, a, b));
  }, [themes, favorites, search, language, category]);

  const themesDisplay = useMemo(
    () => [...themesFavorite].splice(0, maxIndex),
    [themesFavorite, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= themesFavorite.length)
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 5);
    };
    if (ref && refCurrent) {
      refCurrent.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [themesFavorite, maxIndex]);

  const isLoading = useMemo(
    () => maxIndex < themesFavorite.length,
    [themesFavorite, maxIndex]
  );

  return (
    themesFavorite.length > 0 && (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("commun.favorite")}</Typography>
          {!(search !== "") && (
            <Button
              variant="outlined"
              sx={{
                textTransform: "uppercase",
                "&:hover": {
                  border: "2px solid currentColor",
                },
              }}
              color="secondary"
              size="small"
              href={`/favorite`}
            >
              <Typography variant="h6">{t("commun.seeall")}</Typography>
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: px(5),
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
            ref={ref}
          >
            {themesDisplay.map((theme, index) => (
              <CardTheme key={index} theme={theme} />
            ))}
            {isLoading && <SkeletonThemes number={4} />}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
      </Grid>
    )
  );
};

interface PropsSelect {
  selected: Array<number>;
  select: (theme: Theme) => void;
  search?: string;
}
export const FavoriteSelectBlock = ({
  selected,
  select,
  search,
}: PropsSelect) => {
  const { t } = useTranslation();

  const { language } = useUser();
  const { themes, favorites } = useApp();

  const themesFavorite = useMemo(() => {
    const idFavorite = favorites.map((el) => el.theme);
    const themeFilter = search
      ? themes
          .filter((el) => idFavorite.includes(el.id))
          .filter((el) => searchString(search, el.name[language.iso]))
      : themes.filter((el) => idFavorite.includes(el.id));
    const themeUniq = uniqBy(themeFilter, (el) => el.id);
    return themeUniq;
  }, [favorites, themes, search, language.iso]);

  const themesDisplay = [...themesFavorite].sort((a, b) =>
    sortByName(language, a, b)
  );

  return (
    themesFavorite.length > 0 && (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("commun.favorite")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: px(5),
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {themesDisplay.map((theme, index) => (
              <CardSelectTheme
                key={index}
                theme={theme}
                select={selected.includes(theme.id)}
                onSelect={() => select(theme)}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
      </Grid>
    )
  );
};

interface PropsSelectAvatar {
  avatars: Array<{ id: number; avatars: Array<string> }>;
  select: (theme: Theme) => void;
}
export const FavoriteSelectAvatarBlock = ({
  avatars,
  select,
}: PropsSelectAvatar) => {
  const { t } = useTranslation();

  const { language } = useUser();
  const { themes, favorites } = useApp();

  const themesFavorite = useMemo(() => {
    const idFavorite = favorites.map((el) => el.theme);
    const themeFilter = themes.filter((el) => idFavorite.includes(el.id));
    const themeUniq = uniqBy(themeFilter, (el) => el.id);
    return themeUniq;
  }, [themes, favorites]);

  const themesDisplay = [...themesFavorite].sort((a, b) =>
    sortByName(language, a, b)
  );

  return (
    themesFavorite.length > 0 && (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("commun.favorite")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: px(5),
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {themesDisplay.map((theme, index) => (
              <CardSelectAvatarTheme
                key={index}
                theme={theme}
                avatars={avatars}
                onSelect={() => select(theme)}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
      </Grid>
    )
  );
};
