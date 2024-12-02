import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardTheme } from "src/component/card/CardTheme";
import { RankingBlock } from "src/component/RankingBlock";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";

export default function FavoritePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { themes, favorites } = useApp();

  const idFavorite = useMemo(
    () => favorites.map((el) => el.theme),
    [favorites]
  );

  const themesFavorite = useMemo(() => {
    const idFavorite = favorites.map((el) => el.theme);
    return themes
      .filter((el) => idFavorite.includes(el.id))
      .sort((a, b) => sortByName(language, a, b));
  }, [themes, favorites, language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.favorite.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            {idFavorite.length > 0 && (
              <Grid item xs={12}>
                <RankingBlock themes={idFavorite} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h2">{t("commun.themes")}</Typography>
            </Grid>
            {themesFavorite.map((theme) => (
              <Grid item key={theme.id}>
                <CardTheme theme={theme} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
