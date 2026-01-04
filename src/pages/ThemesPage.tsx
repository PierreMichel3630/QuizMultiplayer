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
import { RankingTop5Block } from "src/component/RankingBlock";
import { useAuth } from "src/context/AuthProviderSupabase";

import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "lodash";
import { ChallengeButton } from "src/component/button/ChallengeButton";
import { HeaderApp } from "src/component/header/HeaderApp";
import { CategoriesScrollBlock } from "src/component/scroll/CategoriesScrollBlock";
import { SearchThemeScrollBlock } from "src/component/scroll/SearchThemeScrollBlock";
import { ShopBlock } from "src/component/ShopBlock";
import { UpdatedThemeBlock } from "src/component/theme/UpdatedThemeBlock";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { Colors } from "src/style/Colors";

export default function ThemesPage() {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { t } = useTranslation();

  const { hasPlayChallenge } = useAuth();
  const { headerSize } = useApp();

  const refHeadPage = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  const [searchApi, setSearchApi] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);

  useEffect(() => {
    refHeadPage.current?.scrollIntoView();
  }, [search]);

  const handleChange = (value: string) => {
    setSearch(value);
    debouncedSetSearchApi(value);
  };

  const debouncedSetSearchApi = useMemo(() => {
    return debounce((val: string) => {
      setSearchApi(val);
    }, 300);
  }, []);

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
      <Grid ref={refHeadPage} size={12}>
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
                top: headerSize,
                zIndex: 3,
                pb: 1,
                bgcolor: "background.paper",
                display: "flex",
                gap: 1,
              }}
              size={12}>
              <BasicSearchInput
                label={t("commun.search")}
                onChange={handleChange}
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
            {!hasPlayChallenge && (
              <Grid size={12}>
                <ChallengeButton />
              </Grid>
            )}
            {displaySearch ? (
              <SearchThemeScrollBlock search={searchApi} />
            ) : (
              <>
                <Grid size={12}>
                  <FavoriteBlock />
                </Grid>
                <Grid size={12}>
                  <NewBlock />
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
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
