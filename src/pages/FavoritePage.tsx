import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardTheme } from "src/component/card/CardTheme";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";

export default function FavoritePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { themes, favorites } = useApp();

  const themesFavorite = useMemo(() => {
    const idFavorite = favorites.map((el) => el.theme);
    return themes
      .filter((el) => idFavorite.includes(el.id))
      .sort((a, b) => sortByName(language, a, b));
  }, [themes, favorites, language]);

  return (
    <Box sx={{ width: percent(100) }}>
      <Helmet>
        <title>{`${t("page.favorite.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h1">{t("commun.favorite")}</Typography>
          </Box>
        </Grid>
        {themesFavorite.map((theme) => (
          <Grid item xs={3} sm={2} md={2} lg={1} key={theme.id}>
            <CardTheme theme={theme} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
