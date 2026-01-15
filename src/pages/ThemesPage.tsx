import { Box, Grid } from "@mui/material";
import { percent } from "csx";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FavoriteBlock } from "src/component/FavoriteBlock";

import { CategoriesBlock } from "src/component/CategoriesBlock";
import { GameModeBlock } from "src/component/GameModeBlock";
import { NewBlock } from "src/component/NewBlock";
import { RankingTop5Block } from "src/component/RankingBlock";
import { useAuth } from "src/context/AuthProviderSupabase";

import { ChallengeButton } from "src/component/button/ChallengeButton";
import { HeaderApp } from "src/component/header/HeaderApp";
import { CategoriesScrollBlock } from "src/component/scroll/CategoriesScrollBlock";
import { SearchBlock } from "src/component/search/SearchBlock";
import { ShopBlock } from "src/component/ShopBlock";
import { UpdatedThemeBlock } from "src/component/theme/UpdatedThemeBlock";
import { useAppBar } from "src/context/AppBarProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { useNavigate } from "react-router-dom";
import { MostPlayedThemeBlock } from "src/component/MostPlayedThemeBlock";
import { PreviousGameBlock } from "src/component/PreviousGameBlock";

export default function ThemesPage() {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { hasPlayChallenge } = useAuth();
  const { top } = useAppBar();

  const goSearch = () => {
    navigate(`/searchmobile`, {
      state: {
        search: "",
      },
    });
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.themes.title")} - ${t("appname")}`}</title>
        <meta
          name="description"
          content="Testez vos connaissances. Jouez en Solo ou multijoueurs sur un quiz avec plus de 500 thèmes: Cinéma, Histoire, Géographie, Sports, ..."
        />
      </Helmet>
      {isMobileOrTablet && (
        <Grid size={12}>
          <HeaderApp />
        </Grid>
      )}
      <Grid size={12}>
        <Box
          sx={{
            width: percent(100),
            p: 1,
            position: "relative",
          }}
        >
          <Grid container spacing={1}>
            <Grid
              sx={{
                position: "sticky",
                top: top,
                zIndex: 3,
                bgcolor: "background.paper",
                gap: 1,
                transition: "top 350ms ease-in-out",
                display: "flex",
                flexDirection: "column",
                pt: 1,
              }}
              size={12}
            >
              <SearchBlock search={""} onFocus={() => goSearch()} />
            </Grid>
            {!hasPlayChallenge && (
              <Grid size={12}>
                <ChallengeButton />
              </Grid>
            )}
            <Grid size={12}>
              <NewBlock />
            </Grid>
            <Grid size={12}>
              <FavoriteBlock />
            </Grid>
            <Grid size={12}>
              <PreviousGameBlock />
            </Grid>
            <Grid size={12}>
              <MostPlayedThemeBlock />
            </Grid>
            <Grid size={12}>
              <UpdatedThemeBlock />
            </Grid>
            <Grid size={12}>
              <CategoriesBlock />
            </Grid>
            <Grid size={12}>
              <GameModeBlock />
            </Grid>
            <Grid size={12}>
              <ShopBlock />
            </Grid>
            <Grid size={12}>
              <RankingTop5Block />
            </Grid>
            <Grid size={12}>
              <CategoriesScrollBlock />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
