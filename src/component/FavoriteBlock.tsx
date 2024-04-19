import { Button, Divider, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useBreakpoint } from "src/utils/mediaQuery";
import { CardTheme } from "./card/CardTheme";
import { sortByName } from "src/utils/sort";
import { useUser } from "src/context/UserProvider";
import { searchString } from "src/utils/string";
import { Category } from "src/models/Category";

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

  const breakpoint = useBreakpoint();
  const cols = {
    xs: 3,
    sm: 2,
    md: 2,
    lg: 1,
    xl: 1,
  }[breakpoint];
  const numberCols = 12;
  const itemPerLine = numberCols / cols;
  const themesDisplay = [...themesFavorite]
    .splice(0, itemPerLine)
    .sort((a, b) => sortByName(language, a, b));

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
        {themesDisplay.map((theme) => (
          <Grid item xs={3} sm={2} md={2} lg={1} key={theme.id}>
            <CardTheme theme={theme} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
      </Grid>
    )
  );
};
