import { Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { uniqBy } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";
import { CardSelectAvatarTheme, CardSelectTheme } from "./card/CardTheme";
import { CategoryBlock } from "./category/CategoryBlock";

import BoltIcon from "@mui/icons-material/Bolt";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

export const FavoriteBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { categories, themes, favorites } = useApp();

  const favoriteItems = useMemo(() => {
    const idFavoriteTheme = favorites
      .filter((el) => el.theme !== null)
      .map((el) => el.theme);
    const idFavoriteCategory = favorites
      .filter((el) => el.category !== null)
      .map((el) => el.category);
    const themesFilter = uniqBy(
      themes.filter((el) => idFavoriteTheme.includes(el.id)),
      (el) => el.id
    ).map((el) => ({
      id: el.id,
      name: el.name,
      image: el.image,
      color: el.color,
      link: `/theme/${el.id}`,
      type: TypeCardEnum.THEME,
    }));
    const categoriesFilter = uniqBy(
      categories.filter((el) => idFavoriteCategory.includes(el.id)),
      (el) => el.id
    ).map((el) => ({
      id: el.id,
      name: el.name,
      image: (
        <BoltIcon
          sx={{
            width: 80,
            height: 80,
            color: "white",
          }}
        />
      ),
      color: Colors.colorApp,
      link: `/category/${el.id}`,
      type: TypeCardEnum.CATEGORY,
    }));
    return [...themesFilter, ...categoriesFilter].sort((a, b) =>
      sortByName(language, a, b)
    );
  }, [favorites, themes, categories, language]);

  return (
    favoriteItems.length > 0 && (
      <CategoryBlock
        title={t("commun.favorite")}
        count={favoriteItems.length}
        link={`/favorite`}
        values={favoriteItems}
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
