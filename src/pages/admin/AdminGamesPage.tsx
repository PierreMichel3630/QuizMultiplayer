import { Alert, Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useCallback, useEffect, useState } from "react";
import { selectDuelGames, selectSoloGames } from "src/api/game";
import { GroupButtonAllTypeGame } from "src/component/button/ButtonGroup";
import { CardHistoryGameAdmin } from "src/component/card/CardHistoryGame";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { AutocompleteTheme } from "src/component/Select";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { SkeletonGames } from "src/component/skeleton/SkeletonGame";
import { useApp } from "src/context/AppProvider";
import { DuelGame } from "src/models/DuelGame";
import { GameModeEnum } from "src/models/enum/GameEnum";
import { HistoryGame, SoloGame } from "src/models/Game";
import { FilterGame } from "../HistoryGamePage";

export default function AdminGamesPage() {
  const { t } = useTranslation();
  const { headerSize } = useApp();
  const ITEMPERPAGE = 20;

  const [games, setGames] = useState<Array<HistoryGame>>([]);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterGame>({
    type: GameModeEnum.solo,
    themes: [],
    player: null,
    opponent: undefined,
  });
  const [openModalFriend1, setOpenModalFriend1] = useState(false);
  const [openModalFriend2, setOpenModalFriend2] = useState(false);

  const getGames = useCallback(() => {
    setIsLoading(true);
    if (filter.type === GameModeEnum.solo) {
      selectSoloGames(filter, page, ITEMPERPAGE).then(({ data }) => {
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
        setIsLoading(false);
      });
    } else {
      selectDuelGames(filter, page, ITEMPERPAGE).then(({ data }) => {
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
      <Grid
        sx={{
          position: "sticky",
          top: headerSize,
          p: 1,
          backgroundColor: "background.paper",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
        size={12}>
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
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
          <Grid size={filter.type === GameModeEnum.duel ? 6 : 12}>
            <SelectorProfileBlock
              label={t("commun.selectplayer")}
              profile={filter.player !== null ? filter.player : undefined}
              onChange={() => setOpenModalFriend1(true)}
              onDelete={() => setFilter((prev) => ({ ...prev, player: null }))}
            />
          </Grid>
          {filter.type === GameModeEnum.duel && (
            <Grid size={6}>
              <SelectorProfileBlock
                label={t("commun.selectopponent")}
                profile={filter.opponent}
                onChange={() => setOpenModalFriend2(true)}
                onDelete={() =>
                  setFilter((prev) => ({ ...prev, opponent: undefined }))
                }
              />
            </Grid>
          )}
          <Grid size={12}>
            <AutocompleteTheme
              value={filter.themes}
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, themes: value }));
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {games.map((game) => (
              <Grid key={game.uuid} size={12}>
                <CardHistoryGameAdmin game={game} />
              </Grid>
            ))}
            {isLoading && <SkeletonGames number={10} />}
            {!isLoading && games.length === 0 && isEnd && (
              <Grid size={12}>
                <Alert severity="warning">{t("commun.noresult")}</Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <SelectFriendModal
        open={openModalFriend1}
        close={() => setOpenModalFriend1(false)}
        onValid={(profile) => {
          setFilter((prev) => ({ ...prev, player: profile }));
          setOpenModalFriend1(false);
        }}
        withMe={true}
      />
      <SelectFriendModal
        open={openModalFriend2}
        close={() => setOpenModalFriend2(false)}
        onValid={(profile) => {
          setFilter((prev) => ({ ...prev, opponent: profile }));
          setOpenModalFriend2(false);
        }}
        withMe={false}
      />
    </Grid>
  );
}
