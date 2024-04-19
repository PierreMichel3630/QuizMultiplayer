import { Button, Divider, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { Category } from "src/models/Category";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CardTheme } from "./card/CardTheme";
import { sortByName } from "src/utils/sort";
import { useUser } from "src/context/UserProvider";
import { useBreakpoint } from "src/utils/mediaQuery";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Props {
  category: Category;
}
export const CategoryBlock = ({ category }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { themes } = useApp();
  const { language } = useUser();

  const themesCategory = useMemo(
    () =>
      themes
        .filter((el) => el.category.id === category.id && !el.isfirst)
        .sort((a, b) => sortByName(language, a, b)),
    [category, themes, language]
  );

  const FirstThemesCategory = useMemo(
    () => themes.filter((el) => el.category.id === category.id && el.isfirst),
    [category, themes]
  );

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
  const themesDisplay = [...FirstThemesCategory, ...themesCategory].splice(
    0,
    itemPerLine
  );

  return (
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
        <JsonLanguageBlock variant="h2" sx={{ ml: 2 }} value={category.name} />
        <Button
          variant="outlined"
          sx={{ textTransform: "uppercase", p: "2px 5px" }}
          color="secondary"
          onClick={() => navigate(`/category/${category.id}`)}
        >
          <Typography variant="h6">{t("commun.seeall")}</Typography>
        </Button>
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
  );
};
