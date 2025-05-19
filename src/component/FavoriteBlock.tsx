import { Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";
import { CardSelectAvatarTheme, CardSelectTheme } from "./card/CardTheme";
import { CategoryBlock } from "./category/CategoryBlock";

import { getThemesAndCategoriesById } from "src/api/search";
import { ICardImage } from "./card/CardImage";

export const FavoriteBlock = () => {
  const { t } = useTranslation();
  const { favorites } = useApp();
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (favorites.length > 0) {
      const idCategories = [...favorites]
        .filter((el) => el.category)
        .map((el) => Number(el.category));
      const idThemes = [...favorites]
        .filter((el) => el.theme)
        .map((el) => Number(el.theme));
      getThemesAndCategoriesById(idCategories, idThemes).then(({ data }) => {
        setItemsSearch(data ?? []);
      });
    }
  }, [favorites]);

  return (
    itemsSearch.length > 0 && (
      <CategoryBlock
        title={t("commun.favorite")}
        count={itemsSearch.length}
        link={`/favorite`}
        values={itemsSearch}
      />
    )
  );
};

interface PropsSelect {
  selected: Array<number>;
  select: (theme: Theme) => void;
  search?: string;
}
export const FavoriteSelectBlock = ({ select, search }: PropsSelect) => {
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
                width={90}
                key={index}
                theme={theme}
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
