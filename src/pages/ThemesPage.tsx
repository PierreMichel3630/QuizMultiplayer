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

import head from "src/assets/head.png";
import { ButtonColor } from "src/component/Button";
import { Colors } from "src/style/Colors";
import { useNavigate } from "react-router-dom";

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
      <Grid item xs={12} sx={{ position: "relative" }}>
        <img src={head} style={{ width: percent(100) }} />
        <Box
          sx={{
            position: "absolute",
            top: percent(50),
            left: percent(50),
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h1" color="text.secondary">
            {t("appname")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <ButtonColor
              value={Colors.white}
              label={t("commun.howtoplay")}
              variant="outlined"
              typography="h6"
              onClick={() => navigate("/help")}
            />
            <ButtonColor
              value={Colors.white}
              label={t("commun.faq")}
              variant="outlined"
              typography="h6"
              onClick={() => navigate("/faq")}
            />
            <ButtonColor
              value={Colors.white}
              label={t("commun.installation")}
              variant="outlined"
              typography="h6"
              onClick={() => navigate("/installation")}
            />
          </Box>
        </Box>
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
      </Grid>
    </Grid>
  );
};
