import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "src/component/CategoryBlock";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { BasicSearchInput } from "src/component/Input";
import { CardTheme } from "src/component/card/CardTheme";

import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";

import { ButtonColor } from "src/component/Button";
import { Colors } from "src/style/Colors";
import { useNavigate } from "react-router-dom";
import { SkeletonCategories } from "src/component/skeleton/SkeletonCategory";
import { HeadTitle } from "src/component/HeadTitle";
import { NewBlock } from "src/component/NewBlock";
import { GameModeBlock } from "src/component/GameModeBlock";

export const ThemesPage = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { categories, themes } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const themesFilter = useMemo(
    () => themes.filter((el) => searchString(search, el.name[language.iso])),
    [themes, search, language.iso]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.themes.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle
          title={t("appname")}
          sx={{
            fontFamily: ["Kalam", "cursive"].join(","),
            fontSize: 80,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 50,
            },
          }}
          extra={
            <Box sx={{ display: "flex", gap: 1 }}>
              <ButtonColor
                value={Colors.white}
                label={t("commun.howtoplay")}
                variant="outlined"
                typography="h6"
                onClick={() => navigate("/help")}
                noWrap
              />
              <ButtonColor
                value={Colors.white}
                label={t("commun.faq")}
                variant="outlined"
                typography="h6"
                onClick={() => navigate("/faq")}
                noWrap
              />
              <ButtonColor
                value={Colors.white}
                label={t("commun.installation")}
                variant="outlined"
                typography="h6"
                onClick={() => navigate("/installation")}
                noWrap
              />
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: percent(100), p: 1 }}>
          <Grid container spacing={1}>
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
                  <Grid item xs={3} sm={2} md={1} lg={1} key={theme.id}>
                    <CardTheme theme={theme} />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <GameModeBlock />
                </Grid>
                <Grid item xs={12}>
                  <NewBlock />
                </Grid>
                {categories.length > 0 ? (
                  categories
                    .sort((a, b) => sortByName(language, a, b))
                    .map((category) => (
                      <Grid item xs={12} key={category.id}>
                        <CategoryBlock category={category} />
                      </Grid>
                    ))
                ) : (
                  <SkeletonCategories number={4} />
                )}
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
