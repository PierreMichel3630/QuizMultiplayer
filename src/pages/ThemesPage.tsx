import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useMemo, useState } from "react";
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

import { uniqBy } from "lodash";
import { useNavigate } from "react-router-dom";
import { ButtonColor } from "src/component/Button";
import { GameModeBlock } from "src/component/GameModeBlock";
import { HeadTitle } from "src/component/HeadTitle";
import { NewBlock } from "src/component/NewBlock";
import { RankingBlock } from "src/component/RankingBlock";
import { SkeletonCategories } from "src/component/skeleton/SkeletonCategory";
import { Colors } from "src/style/Colors";

export default function ThemesPage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { categories, themes, nbQuestions, nbThemes, isLoadingTheme } =
    useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [maxIndex, setMaxIndex] = useState(5);

  const themesFilter = useMemo(
    () =>
      uniqBy(
        themes.filter((el) => searchString(search, el.name[language.iso])),
        (el) => el.id
      ),
    [themes, search, language.iso]
  );

  const categoriesFilter = useMemo(
    () =>
      [...categories]
        .sort((a, b) => sortByName(language, a, b))
        .splice(0, maxIndex),
    [categories, maxIndex, language]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
          document.documentElement.offsetHeight ||
        maxIndex >= categories.length
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 5);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [maxIndex, categories]);

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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {nbQuestions && (
                  <Box>
                    <Typography
                      variant="h6"
                      component="span"
                      color="text.secondary"
                    >
                      {`${nbQuestions}  `}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="span"
                      color="text.secondary"
                    >
                      {t("commun.questions")}
                    </Typography>
                  </Box>
                )}
                {nbThemes && (
                  <Box>
                    <Typography
                      variant="h6"
                      component="span"
                      color="text.secondary"
                    >
                      {`${nbThemes}  `}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="span"
                      color="text.secondary"
                    >
                      {t("commun.themes")}
                    </Typography>
                  </Box>
                )}
              </Box>
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
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            width: percent(100),
            p: 1,
          }}
        >
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sx={{
                position: "sticky",
                top: 55,
                zIndex: 3,
                pb: 1,
                backgroundColor: Colors.white,
              }}
            >
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
                  <Grid item key={theme.id}>
                    <CardTheme theme={theme} />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {isLoadingTheme ? (
                  <SkeletonCategories number={1} />
                ) : (
                  <Grid item xs={12}>
                    <GameModeBlock />
                  </Grid>
                )}
                {isLoadingTheme ? (
                  <SkeletonCategories number={1} />
                ) : (
                  <Grid item xs={12}>
                    <NewBlock />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <RankingBlock />
                </Grid>
                {categoriesFilter.map((category) => (
                  <Grid item xs={12} key={category.id}>
                    <CategoryBlock category={category} />
                  </Grid>
                ))}

                {(isLoadingTheme ||
                  categoriesFilter.length < categories.length) && (
                  <SkeletonCategories number={4} />
                )}
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
