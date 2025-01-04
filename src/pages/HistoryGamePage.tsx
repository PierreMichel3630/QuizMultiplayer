import { Alert, Box, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { selectGamesByPlayer } from "src/api/game";
import { GroupButtonAllTypeGame } from "src/component/button/ButtonGroup";
import { CardHistoryGame } from "src/component/card/CardHistoryGame";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { AutocompleteTheme } from "src/component/Select";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { SkeletonGames } from "src/component/skeleton/SkeletonGame";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { GameModeEnum } from "src/models/enum/GameEnum";
import { HistoryGame } from "src/models/Game";
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";

export interface FilterGame {
  type: GameModeEnum;
  themes: Array<Theme>;
  player: Profile | null;
  opponent?: Profile;
}
export default function HistoryGamePage() {
  const { t } = useTranslation();
  const location = useLocation();

  const { headerSize } = useApp();
  const { profile } = useAuth();

  const ITEMPERPAGE = 10;

  const [games, setGames] = useState<Array<HistoryGame>>([]);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterGame>({
    type: GameModeEnum.all,
    themes: [],
    player: profile,
    opponent: undefined,
  });
  const [openModalFriend, setOpenModalFriend] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFilter((prev) => ({
        ...prev,
        player: profile,
        opponent: location.state.opponent,
        type: location.state.type
          ? (location.state.type as GameModeEnum)
          : GameModeEnum.all,
      }));
    }
  }, [location.state, profile]);

  const getGames = useCallback(() => {
    setIsLoading(true);
    if (filter.player !== undefined) {
      selectGamesByPlayer(filter, page, ITEMPERPAGE).then(({ data }) => {
        const result = data as Array<HistoryGame>;
        setGames((prev) => (page === 0 ? [...result] : [...prev, ...result]));
        setIsEnd(result.length === 0);
        setIsLoading(false);
      });
    }
  }, [page, filter]);

  useEffect(() => {
    if (!isEnd) {
      getGames();
    }
  }, [isEnd, page, getGames]);

  useEffect(() => {
    setIsLoading(true);
    setGames([]);
    setPage(0);
    setIsEnd(false);
  }, [filter]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (!isEnd && !isLoading) setPage((prev) => prev + 1);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd, isLoading]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.history.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: headerSize,
          p: 1,
          backgroundColor: "background.paper",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <GroupButtonAllTypeGame
              selected={filter.type}
              onChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  type: value,
                }));
              }}
            />
          </Grid>
          {filter.type === GameModeEnum.duel && (
            <Grid item xs={12}>
              <SelectorProfileBlock
                label={t("commun.selectopponent")}
                profile={filter.opponent}
                onChange={() => setOpenModalFriend(true)}
                onDelete={() =>
                  setFilter((prev) => ({ ...prev, opponent: undefined }))
                }
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <AutocompleteTheme
              value={filter.themes}
              onChange={(value: Array<Theme>) => {
                setFilter((prev) => ({ ...prev, themes: value }));
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {games.map((game) => (
              <Grid item xs={12} key={game.uuid}>
                <CardHistoryGame game={game} />
              </Grid>
            ))}
            {isLoading && <SkeletonGames number={10} />}
            {!isLoading && games.length === 0 && isEnd && (
              <Grid item xs={12}>
                <Alert severity="warning">{t("commun.noresult")}</Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <SelectFriendModal
        open={openModalFriend}
        close={() => setOpenModalFriend(false)}
        onValid={(profile) => {
          setFilter((prev) => ({ ...prev, opponent: profile }));
          setOpenModalFriend(false);
        }}
        withMe={true}
      />
    </Grid>
  );
}
