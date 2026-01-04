import { Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { CardSelectAvatarTheme } from "./card/CardTheme";
import { CategoryBlock } from "./category/CategoryBlock";

import { getThemesAndCategoriesById, getThemesById } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "./card/CardImage";

export const FavoriteBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { favorites } = useApp();

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (favorites.length > 0 && language) {
      const idCategories = [...favorites]
        .filter((el) => el.category)
        .map((el) => Number(el.category));
      const idThemes = [...favorites]
        .filter((el) => el.theme)
        .map((el) => Number(el.theme));
      getThemesAndCategoriesById(language, idCategories, idThemes).then(
        ({ data }) => {
          setItemsSearch(data ?? []);
        }
      );
    }
  }, [favorites, language]);

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

interface PropsSelectAvatar {
  avatars: Array<{ id: number; avatars: Array<string> }>;
  select: (theme: ICardImage) => void;
}
export const FavoriteSelectAvatarBlock = ({
  avatars,
  select,
}: PropsSelectAvatar) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const { favorites } = useApp();
  const [values, setValues] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const idThemes = [...favorites]
      .filter((el) => el.theme)
      .map((el) => Number(el.theme));
    if (language && idThemes.length > 0) {
      getThemesById(idThemes, language).then(({ data }) => {
        setValues(data ?? []);
      });
    }
  }, [favorites, language]);

  return (values.length > 0 && (<Grid container spacing={1}>
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      size={12}>
      <Typography variant="h2">{t("commun.favorite")}</Typography>
    </Grid>
    <Grid size={12}>
      <Box
        sx={{
          display: "flex",
          gap: px(5),
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {values.map((theme, index) => (
          <CardSelectAvatarTheme
            key={index}
            theme={theme}
            avatars={avatars}
            onSelect={() => select(theme)}
          />
        ))}
      </Box>
    </Grid>
    <Grid size={12}>
      <Divider sx={{ borderBottomWidth: 5 }} />
    </Grid>
  </Grid>));
};
