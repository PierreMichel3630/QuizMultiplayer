import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";
import { CardTheme } from "./card/CardTheme";
import { px } from "csx";

interface Props {
  search?: string;
  category?: Category;
}
export const FavoriteBlock = ({ search, category }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { language } = useUser();
  const { themes, favorites } = useApp();

  const themesFavorite = useMemo(() => {
    const idFavorite = favorites.map((el) => el.theme);
    const themeFilter = themes.filter((el) =>
      category
        ? idFavorite.includes(el.id) && el.category.id === category.id
        : idFavorite.includes(el.id)
    );
    return search
      ? themeFilter.filter((el) => searchString(search, el.name[language.iso]))
      : themeFilter;
  }, [themes, favorites, search, language.iso, category]);

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
          {!(search !== "") && (
            <Button
              variant="outlined"
              sx={{ textTransform: "uppercase", p: "2px 5px" }}
              color="secondary"
              onClick={() => navigate(`/favorite`)}
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
          >
            {themesDisplay.map((theme) => (
              <Box key={theme.id} sx={{ maxWidth: px(100) }}>
                <CardTheme theme={theme} />
              </Box>
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
