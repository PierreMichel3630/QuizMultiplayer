import { Alert, Box, Divider, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardTheme } from "src/component/card/CardTheme";
import { CategoryBlock } from "src/component/CategoryBlock";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { BasicSearchInput } from "src/component/Input";

import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";

import { uniqBy } from "lodash";
import { CardCategory } from "src/component/card/CardCategory";
import { CategoriesBlock } from "src/component/CategoriesBlock";
import { GameModeBlock } from "src/component/GameModeBlock";
import { NewBlock } from "src/component/NewBlock";
import { PreviousGameBlock } from "src/component/PreviousGameBlock";
import { RankingTop5Block } from "src/component/RankingBlock";
import { SkeletonCategories } from "src/component/skeleton/SkeletonCategory";
import { useAuth } from "src/context/AuthProviderSupabase";

import AppleIcon from "@mui/icons-material/Apple";
import { Link, useNavigate } from "react-router-dom";
import googleplay from "src/assets/google-play.png";
import { ButtonColor } from "src/component/Button";
import { HeadTitle } from "src/component/HeadTitle";
import { Colors } from "src/style/Colors";
import { urlApple, urlGooglePlay } from "./help/InstallationPage";

export default function ThemesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { language } = useUser();
  const { user } = useAuth();
  const {
    categories,
    nbQuestions,
    nbThemes,
    themes,
    isLoadingTheme,
    headerSize,
  } = useApp();

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

  const categoriesSearch = useMemo(
    () =>
      uniqBy(
        [...categories]
          .filter((el) => searchString(search, el.name[language.iso]))
          .sort((a, b) => sortByName(language, a, b)),
        (el) => el.id
      ),
    [categories, search, language]
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
        window.innerHeight + document.documentElement.scrollTop + 1000 <=
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
        <meta
          name="description"
          content="Testez vos connaissances. Jouez en Solo ou multijoueurs sur un quiz avec plus de 500 thèmes: Cinéma, Histoire, Géographie, Sports, ..."
        />
      </Helmet>
      {user === null && (
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
                  gap: px(5),
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
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Link
                    to={urlGooglePlay}
                    style={{
                      textDecoration: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: px(5),
                        p: px(6),
                        backgroundColor: Colors.black,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <img src={googleplay} style={{ width: px(20) }} />
                      <Typography variant="h6" color="text.secondary" noWrap>
                        {t("commun.googleplay")}
                      </Typography>
                    </Box>
                  </Link>
                  <Link
                    to={urlApple}
                    style={{
                      textDecoration: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: px(5),
                        p: px(6),
                        backgroundColor: Colors.black,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <AppleIcon sx={{ color: "white", fontSize: px(20) }} />
                      <Typography variant="h6" color="text.secondary">
                        {t("commun.apple")}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
              </Box>
            }
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Box
          sx={{
            width: percent(100),
            p: 1,
            position: "relative",
          }}
        >
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sx={{
                position: "sticky",
                top: headerSize,
                zIndex: 3,
                pb: 1,
                bgcolor: "background.paper",
              }}
            >
              <BasicSearchInput
                label={t("commun.search")}
                onChange={(value) => setSearch(value)}
                value={search}
                clear={() => setSearch("")}
              />
            </Grid>
            {user && (
              <Grid item xs={12}>
                <FavoriteBlock search={search} />
              </Grid>
            )}
            {search !== "" ? (
              <>
                {categoriesSearch.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h2">
                        {t("commun.categories")}
                      </Typography>
                    </Grid>
                    {categoriesSearch.map((category) => (
                      <Grid item key={category.id}>
                        <CardCategory category={category} />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Divider sx={{ borderBottomWidth: 5 }} />
                    </Grid>
                  </>
                )}
                {themesFilter.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h2">{t("commun.themes")}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        {themesFilter.map((theme) => (
                          <Grid item key={theme.id}>
                            <CardTheme theme={theme} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </>
                )}
                {themesFilter.length === 0 && categoriesSearch.length === 0 && (
                  <Grid item xs={12}>
                    <Alert severity="warning">{t("commun.noresult")}</Alert>
                  </Grid>
                )}
              </>
            ) : (
              <>
                {user && (
                  <Grid item xs={12}>
                    <PreviousGameBlock />
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
                  <CategoriesBlock />
                </Grid>
                <Grid item xs={12}>
                  <RankingTop5Block />
                </Grid>
                {isLoadingTheme ? (
                  <SkeletonCategories number={1} />
                ) : (
                  <Grid item xs={12}>
                    <GameModeBlock />
                  </Grid>
                )}
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
