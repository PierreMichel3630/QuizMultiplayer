import { Alert, Box, Grid } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CategoryWithThemeBlock } from "src/component/CategoryWithThemeBlock";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { BasicSearchInput } from "src/component/Input";

import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";

import { CategoriesBlock } from "src/component/CategoriesBlock";
import { GameModeBlock } from "src/component/GameModeBlock";
import { NewBlock } from "src/component/NewBlock";
import { PreviousGameBlock } from "src/component/PreviousGameBlock";
import { RankingTop5Block } from "src/component/RankingBlock";
import { SkeletonCategories } from "src/component/skeleton/SkeletonCategory";
import { useAuth } from "src/context/AuthProviderSupabase";

import BoltIcon from "@mui/icons-material/Bolt";
import { uniqBy } from "lodash";
import { CardImage, ICardImage } from "src/component/card/CardImage";
import { HeaderApp } from "src/component/header/HeaderApp";
import { ShopBlock } from "src/component/ShopBlock";
import { UpdatedThemeBlock } from "src/component/theme/UpdatedThemeBlock";
import { Colors } from "src/style/Colors";
import CloseIcon from "@mui/icons-material/Close";
import { ChallengeButton } from "src/component/button/ChallengeButton";
import moment from "moment";

export default function ThemesPage() {
  const { t } = useTranslation();

  const { language } = useUser();
  const { user, profile } = useAuth();
  const { categories, themes, isLoadingTheme, headerSize } = useApp();

  const [search, setSearch] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);
  const [maxIndex, setMaxIndex] = useState(5);

  const itemsSearch = useMemo(() => {
    let res: Array<ICardImage> = [];
    const categoriesSearch = [...categories]
      .filter((el) => searchString(search, el.name[language.iso]))
      .map((el) => ({
        id: el.id,
        name: el.name,
        image: (
          <BoltIcon
            sx={{
              width: 80,
              height: 80,
              color: "white",
            }}
          />
        ),
        color: Colors.colorApp,
        link: `/category/${el.id}`,
      }));

    const themesSearch = uniqBy(
      [...themes].filter((el) => searchString(search, el.name[language.iso])),
      (el) => el.id
    ).map((el) => ({
      id: el.id,
      name: el.name,
      image: el.image,
      color: el.color,
      link: `/theme/${el.id}`,
    }));
    res = [...themesSearch, ...categoriesSearch].sort((a, b) =>
      sortByName(language, a, b)
    );

    return res;
  }, [themes, categories, search, language]);

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

  const hasPlayChallenge = useMemo(() => {
    const today = moment();
    const lastPlay = profile?.lastchallengeplay
      ? moment(profile?.lastchallengeplay)
      : null;
    return lastPlay !== null ? today.isSame(lastPlay, "day") : false;
  }, [profile]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.themes.title")} - ${t("appname")}`}</title>
        <meta
          name="description"
          content="Testez vos connaissances. Jouez en Solo ou multijoueurs sur un quiz avec plus de 500 thèmes: Cinéma, Histoire, Géographie, Sports, ..."
        />
      </Helmet>
      <Grid item xs={12}>
        <HeaderApp />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            width: percent(100),
            p: 1,
            position: "relative",
          }}
        >
          <Grid container spacing={1}>
            {!hasPlayChallenge && (
              <Grid item xs={12}>
                <ChallengeButton />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{
                position: "sticky",
                top: headerSize,
                zIndex: 3,
                pb: 1,
                bgcolor: "background.paper",
                display: "flex",
                gap: 1,
              }}
            >
              <BasicSearchInput
                label={t("commun.search")}
                onChange={(value) => setSearch(value)}
                onFocus={() => setDisplaySearch(true)}
                value={search}
              />
              {displaySearch && (
                <Box
                  sx={{
                    backgroundColor: Colors.red,
                    borderRadius: px(5),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSearch("");
                    setDisplaySearch(false);
                  }}
                >
                  <CloseIcon fontSize="large" sx={{ color: Colors.white }} />
                </Box>
              )}
            </Grid>
            {displaySearch ? (
              <>
                {itemsSearch.length === 0 ? (
                  <Grid item xs={12}>
                    <Alert severity="warning">{t("commun.noresult")}</Alert>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Grid container spacing={1} justifyContent="center">
                      {itemsSearch.map((item, index) => (
                        <Grid item key={index}>
                          <CardImage value={item} />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <FavoriteBlock />
                </Grid>
                {user && (
                  <Grid item xs={12}>
                    <PreviousGameBlock />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <NewBlock />
                </Grid>
                <Grid item xs={12}>
                  <UpdatedThemeBlock />
                </Grid>
                <Grid item xs={12}>
                  <CategoriesBlock />
                </Grid>
                <Grid item xs={12}>
                  <GameModeBlock />
                </Grid>
                <Grid item xs={12}>
                  <ShopBlock />
                </Grid>
                <Grid item xs={12}>
                  <RankingTop5Block />
                </Grid>
                {categoriesFilter.map((category) => (
                  <Grid item xs={12} key={category.id}>
                    <CategoryWithThemeBlock category={category} />
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
