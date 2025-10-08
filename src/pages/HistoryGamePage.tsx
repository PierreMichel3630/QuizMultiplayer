import { Alert, Box, Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { selectDuelGamesByPlayer, selectSoloGamesByPlayer } from "src/api/game";
import { GroupButtonAllTypeGame } from "src/component/button/ButtonGroup";
import { CardHistoryGame } from "src/component/card/CardHistoryGame";
import { ICardImage } from "src/component/card/CardImage";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { SkeletonGames } from "src/component/skeleton/SkeletonGame";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { DuelGame } from "src/models/DuelGame";
import { GameModeEnum } from "src/models/enum/GameEnum";
import { HistoryGame, SoloGame } from "src/models/Game";
import { Profile } from "src/models/Profile";

export interface FilterGame {
  type: GameModeEnum;
  themes: Array<ICardImage>;
  player: Profile | null;
  opponent?: Profile;
}
export default function HistoryGamePage() {
  const { t } = useTranslation();
  const location = useLocation();

  const { headerSize } = useApp();
  const { profile } = useAuth();

  const ITEMPERPAGE = 10;
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const [games, setGames] = useState<Array<HistoryGame>>([]);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterGame>({
    type: GameModeEnum.solo,
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
          : GameModeEnum.solo,
      }));
    }
  }, [location.state, profile]);

  const getGames = useCallback(
    (page: number) => {
      if (page === 0) {
        window.scrollTo(0, 0);
      }
      if (loading) return;
      if (!isEnd && filter.player !== null) {
        if (filter.type === GameModeEnum.solo) {
          selectSoloGamesByPlayer(filter, page, ITEMPERPAGE).then(
            ({ data }) => {
              const result = data as unknown as Array<SoloGame>;

              const historygames: Array<HistoryGame> = result.map((el) => {
                return {
                  uuid: el.uuid,
                  type: "SOLO",
                  theme: el.theme,
                  player1: el.profile,
                  ptsplayer1: el.points,
                  player2: undefined,
                  ptsplayer2: null,
                  created_at: el.created_at,
                };
              });

              setGames((prev) =>
                page === 0 ? [...historygames] : [...prev, ...historygames]
              );
              setIsEnd(result.length === 0);
              setLoading(false);
            }
          );
        } else {
          selectDuelGamesByPlayer(filter, page, ITEMPERPAGE).then(
            ({ data }) => {
              const result = data as unknown as Array<DuelGame>;

              const historygames: Array<HistoryGame> = result.map((el) => {
                return {
                  uuid: el.uuid,
                  type: "DUEL",
                  theme: el.theme,
                  player1: el.player1,
                  ptsplayer1: el.ptsplayer1,
                  player2: el.player2,
                  ptsplayer2: el.ptsplayer2,
                  created_at: el.created_at,
                };
              });

              setGames((prev) =>
                page === 0 ? [...historygames] : [...prev, ...historygames]
              );
              setIsEnd(result.length === 0);
              setLoading(false);
            }
          );
        }
      }
    },
    [isEnd, loading, filter]
  );

  useEffect(() => {
    setPage(0);
    setGames([]);
    setIsEnd(false);
    getGames(0);
  }, [filter]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getGames(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [games, loading, isEnd, getGames]);

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
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {games.map((game, index) => (
              <Grid
                item
                xs={12}
                key={game.uuid}
                ref={index === games.length - 1 ? lastItemRef : null}
              >
                <CardHistoryGame game={game} />
              </Grid>
            ))}
            {!isEnd && <SkeletonGames number={10} />}
            {!loading && games.length === 0 && isEnd && (
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
