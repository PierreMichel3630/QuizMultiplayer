import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { CardTheme } from "src/component/card/CardTheme";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { sortByName } from "src/utils/sort";

export const CategoryPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { language } = useUser();
  const { categories, themes } = useApp();

  const [category, setCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    setCategory(categories.find((el) => el.id === Number(id)));
  }, [categories, id]);

  const themesCategory = useMemo(
    () =>
      category
        ? themes
            .filter((el) => el.category.id === category.id && !el.isfirst)
            .sort((a, b) => sortByName(language, a, b))
        : [],
    [category, themes, language]
  );

  const FirstThemesCategory = useMemo(
    () =>
      category
        ? themes.filter((el) => el.category.id === category.id && el.isfirst)
        : [],
    [category, themes]
  );

  const themesDisplay = [...FirstThemesCategory, ...themesCategory];
  return (
    <Box sx={{ width: percent(100), p: 1 }}>
      <Helmet>
        <title>
          {category
            ? `${category.name[language.iso]} - ${t("appname")}`
            : t("appname")}
        </title>
      </Helmet>
      <Grid container spacing={1} justifyContent="center">
        {category && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <JsonLanguageBlock
                variant="h1"
                value={category.name}
                sx={{ wordBreak: "break-all" }}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <FavoriteBlock category={category} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">{t("commun.themes")}</Typography>
        </Grid>
        {themesDisplay.map((theme) => (
          <Grid item key={theme.id}>
            <Box sx={{ maxWidth: 100 }}>
              <CardTheme theme={theme} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
