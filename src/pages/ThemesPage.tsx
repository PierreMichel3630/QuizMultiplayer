import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "src/component/CategoryBlock";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { BasicSearchInput } from "src/component/Input";
import { RuleBlock } from "src/component/RuleBlock";
import { CardTheme } from "src/component/card/CardTheme";

import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";

export const ThemesPage = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { categories, themes, refreshThemes } = useApp();

  const [search, setSearch] = useState("");

  const themesFilter = useMemo(
    () => themes.filter((el) => searchString(search, el.name[language.iso])),
    [themes, search, language.iso]
  );

  useEffect(() => {
    refreshThemes();
  }, []);

  return (
    <Box sx={{ width: percent(100), p: 1 }}>
      <Grid container spacing={1}>
        <Helmet>
          <title>{`${t("pages.themes.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1">{t("appname")}</Typography>
          <Typography variant="h4">{t("description")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <RuleBlock />
        </Grid>
        <Grid item xs={12}>
          <BasicSearchInput
            label={t("commun.search")}
            onChange={(value) => setSearch(value)}
            value={search}
            clear={() => setSearch("")}
          />
        </Grid>
        <Grid item xs={12}>
          <FavoriteBlock search={search} />
        </Grid>
        {search !== "" ? (
          <>
            <Grid item xs={12}>
              <Typography variant="h2">{t("commun.search")}</Typography>
            </Grid>
            {themesFilter.map((theme) => (
              <Grid item xs={3} sm={2} md={2} lg={1} key={theme.id}>
                <CardTheme theme={theme} />
              </Grid>
            ))}
          </>
        ) : (
          categories
            .sort((a, b) => sortByName(language, a, b))
            .map((category) => (
              <Grid item xs={12} key={category.id}>
                <CategoryBlock category={category} />
              </Grid>
            ))
        )}
      </Grid>
    </Box>
  );
};
