import { Box, Grid } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FavoriteBlock } from "src/component/FavoriteBlock";
import { BasicSearchInput } from "src/component/Input";

import { useApp } from "src/context/AppProvider";

import { CategoriesBlock } from "src/component/CategoriesBlock";
import { GameModeBlock } from "src/component/GameModeBlock";
import { NewBlock } from "src/component/NewBlock";
import { PreviousGameBlock } from "src/component/PreviousGameBlock";
import { RankingTop5Block } from "src/component/RankingBlock";
import { useAuth } from "src/context/AuthProviderSupabase";

import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { ChallengeButton } from "src/component/button/ChallengeButton";
import { HeaderApp } from "src/component/header/HeaderApp";
import { CategoriesScrollBlock } from "src/component/scroll/CategoriesScrollBlock";
import { SearchThemeScrollBlock } from "src/component/scroll/SearchThemeScrollBlock";
import { ShopBlock } from "src/component/ShopBlock";
import { UpdatedThemeBlock } from "src/component/theme/UpdatedThemeBlock";
import { Colors } from "src/style/Colors";

export default function ThemesPage() {
  const { t } = useTranslation();

  const { user, profile } = useAuth();
  const { headerSize } = useApp();

  const refHeadPage = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);

  useEffect(() => {
    refHeadPage.current?.scrollIntoView();
  }, [search]);

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
      <Grid item xs={12} ref={refHeadPage}>
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
              <SearchThemeScrollBlock search={search} />
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
                <Grid item xs={12}>
                  <CategoriesScrollBlock />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
