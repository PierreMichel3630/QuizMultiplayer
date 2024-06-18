import { Box, Container, Divider, Grid } from "@mui/material";
import { percent, px } from "csx";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteBattleByUuid,
  launchDuelGame,
  selectBattleGameByUuid,
  updateBattleGameByUuid,
} from "src/api/game";
import { supabase } from "src/api/supabase";
import { ButtonColor } from "src/component/Button";
import { FavoriteSelectAvatarBlock } from "src/component/FavoriteBlock";
import { SelectedTheme } from "src/component/SelectedTheme";
import { SelectorProfileBattleBlock } from "src/component/SelectorProfileBlock";
import { CardSelectAvatarTheme } from "src/component/card/CardTheme";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import {
  BattleGame,
  BattleGameChange,
  BattleGameUpdate,
} from "src/models/BattleGame";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { shuffle, sortByName } from "src/utils/sort";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { HistoryGameModal } from "src/component/modal/HistoryGameModal";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";

export const BattlePage = () => {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { user } = useAuth();
  const { language } = useUser();
  const { themes } = useApp();
  const navigate = useNavigate();

  const [game, setGame] = useState<BattleGame | null>(null);
  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const isPlayer1 = useMemo(
    () => (user && game ? user.id === game.player1.id : null),
    [game, user]
  );

  const isReady = useMemo(
    () =>
      game &&
      ((isPlayer1 && game.readyplayer1) || (!isPlayer1 && game.readyplayer2)),
    [game, isPlayer1]
  );

  const getHistory = () => {
    setIsOpenHistory(true);
  };

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectBattleGameByUuid(uuidGame).then(({ data }) => {
          setGame(data);
        });
      }
    };
    getGame();
  }, [uuidGame]);

  const deleteGame = useCallback(async () => {
    if (game && game.player2 === null) {
      await deleteBattleByUuid(game.uuid);
    }
  }, [game]);

  useEffect(() => {
    if (game) {
      const channel = supabase
        .channel(game.uuid)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "battlegame",
            filter: `uuid=eq.${game.uuid}`,
          },
          (payload) => {
            const change = payload.new as BattleGameChange;
            setGame((prev) =>
              prev
                ? {
                    ...prev,
                    scoreplayer1: change.scoreplayer1,
                    scoreplayer2: change.scoreplayer2,
                    themesplayer1: change.themesplayer1,
                    themesplayer2: change.themesplayer2,
                    readyplayer1: change.readyplayer1,
                    readyplayer2: change.readyplayer2,
                    game: change.game,
                    games: change.games,
                  }
                : prev
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "battlegame",
            filter: `uuid=eq.${game.uuid}`,
          },
          () => {
            navigate(`/`);
          }
        )
        .subscribe();
      return () => {
        deleteGame();
        channel.unsubscribe();
      };
    }
  }, [deleteGame, game, navigate]);

  const updateGame = (value: BattleGameUpdate) => {
    updateBattleGameByUuid(value).then(({ data }) => {
      setGame(data);
    });
  };

  const selectTheme = useCallback(
    async (theme: Theme) => {
      if (game && isPlayer1 !== null) {
        const myThemes = isPlayer1
          ? [...game.themesplayer1]
          : [...game.themesplayer2];
        const isSelect = myThemes.includes(theme.id);
        const newThemes = isSelect
          ? [...myThemes].filter((el) => el !== theme.id)
          : [...myThemes, theme.id];
        const value = isPlayer1
          ? {
              uuid: game.uuid,
              themesplayer1: newThemes,
            }
          : { uuid: game.uuid, themesplayer2: newThemes };
        await updateBattleGameByUuid(value);
      }
    },
    [game, isPlayer1]
  );

  const themesFilter = useMemo(
    () =>
      uniqBy(themes, (el) => el.id).sort((a, b) => sortByName(language, a, b)),
    [themes, language]
  );

  const ready = useCallback(() => {
    if (game) {
      const value = isPlayer1
        ? { uuid: game.uuid, readyplayer1: !game.readyplayer1 }
        : { uuid: game.uuid, readyplayer2: !game.readyplayer2 };
      updateGame(value);
    }
  }, [isPlayer1, game]);

  const avatars = useMemo(() => {
    let res: Array<{ id: number; avatars: Array<string> }> = [];
    if (game) {
      const themesplayer1 = [...game.themesplayer1];
      const themesplayer2 = [...game.themesplayer2];
      const distinctTheme = uniqBy(
        [...themesplayer1, ...themesplayer2],
        (el) => el
      );
      res = distinctTheme.map((el) => {
        const avatars = [];
        if (themesplayer1.includes(el)) {
          avatars.push(game.player1.avatar.icon);
        }
        if (game.player2 && themesplayer2.includes(el)) {
          avatars.push(game.player2.avatar.icon);
        }
        return { id: el, avatars };
      });
    }

    return res;
  }, [game]);

  useEffect(() => {
    if (
      !isStart &&
      game &&
      isPlayer1 &&
      game.player2 !== null &&
      game.game === null &&
      game.readyplayer1 &&
      game.readyplayer2 &&
      (game.themesplayer1.length > 0 || game.themesplayer2.length > 0)
    ) {
      setIsStart(true);
      const themeRandom = [...game.themesplayer2, ...game.themesplayer1].sort(
        shuffle
      )[0];
      launchDuelGame(
        game.player1.id,
        game.player2.id,
        themeRandom,
        game.uuid
      ).then(({ data }) => {
        updateGame({ uuid: game.uuid, game: data.uuid });
      });
    }
  }, [game, isPlayer1, isStart]);

  useEffect(() => {
    if (game && game.game) {
      navigate(`/duel/${game.game}`);
    }
  }, [game, navigate]);

  const resetGame = useCallback(() => {
    if (game) {
      updateGame({
        uuid: game.uuid,
        scoreplayer1: 0,
        scoreplayer2: 0,
        games: [],
      });
      setOpenConfirmModal(false);
    }
  }, [game]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: percent(100), p: 1, overflow: "hidden" }}>
        <Helmet>
          <title>{`${t("pages.battle.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid
            item
            xs={12}
            sx={{ backgroundColor: Colors.blue3, marginBottom: px(125) }}
          >
            <BarNavigation title="Jouer" quit={deleteGame} />
          </Grid>
          {game && (
            <>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    backgroundColor: "white",
                    position: "fixed",
                    top: 52,
                    left: 0,
                    zIndex: 2,
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <SelectorProfileBattleBlock
                      label={t("commun.selectplayer")}
                      profile={game.player1}
                      score={game.scoreplayer1}
                      ready={game.readyplayer1}
                    />
                    <RestartAltIcon onClick={() => setOpenConfirmModal(true)} />
                    <SelectorProfileBattleBlock
                      label={t("commun.selectplayer")}
                      profile={game.player2 ?? undefined}
                      onChange={() => setOpenModalFriend(true)}
                      score={game.scoreplayer2}
                      ready={game.readyplayer2}
                      left
                    />
                  </Box>
                  <Divider sx={{ borderBottomWidth: 5 }} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={12}>
                    <SelectedTheme
                      avatars={avatars}
                      select={(t) => selectTheme(t)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FavoriteSelectAvatarBlock
                      select={(t) => selectTheme(t)}
                      avatars={avatars}
                    />
                  </Grid>
                  {themesFilter.map((t) => {
                    return (
                      <Grid item key={t.id}>
                        <CardSelectAvatarTheme
                          theme={t}
                          avatars={avatars}
                          onSelect={() => selectTheme(t)}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            zIndex: 10,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{ p: 1, display: "flex", gap: 1, flexDirection: "column" }}
            >
              <ButtonColor
                value={Colors.blue}
                label={t("commun.gamehistory")}
                variant="contained"
                onClick={getHistory}
                endIcon={<HistoryIcon />}
              />
              <ButtonColor
                value={isReady ? Colors.green : Colors.red}
                label={t("commun.ready")}
                variant="contained"
                onClick={ready}
                endIcon={isReady ? <CheckIcon /> : <CloseIcon />}
              />
            </Box>
          </Container>
        </Box>
        <SelectFriendModal
          open={openModalFriend}
          close={() => setOpenModalFriend(false)}
          onValid={(profile) => {
            setOpenModalFriend(false);
            if (uuidGame) {
              updateGame({
                uuid: uuidGame,
                player2: profile.id,
              });
            }
          }}
        />
        {game && game.player2 && (
          <HistoryGameModal
            open={isOpenHistory}
            close={() => setIsOpenHistory(false)}
            games={game.games}
            player1={game.player1}
            player2={game.player2}
          />
        )}
        <ConfirmDialog
          title={t("modal.resetgame")}
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          onConfirm={resetGame}
        />
      </Box>
    </Container>
  );
};
