import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { RankingBlock } from "src/component/RankingBlock";
import { CardTheme } from "src/component/card/CardTheme";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { sortByName } from "src/utils/sort";

export default function CategoryPage() {
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

  const idthemes = useMemo(
    () =>
      themes
        .filter((el) => category && el.category.id === category.id)
        .map((el) => el.id),
    [themes, category]
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
    <Grid container>
      <Helmet>
        <title>
          {category
            ? `${category.name[language.iso]} - ${t("appname")}`
            : t("appname")}
        </title>
        {category && (
          <meta
            name="description"
            content={`${t("appname")} Catégorie ${category.name[language.iso]}`}
          />
        )}
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            {idthemes.length > 0 && (
              <Grid item xs={12}>
                <RankingBlock themes={idthemes} />
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
                <CardTheme theme={theme} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
