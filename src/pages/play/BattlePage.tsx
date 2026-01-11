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
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { SelectedTheme } from "src/component/SelectedTheme";
import { SelectorProfileBattleBlock } from "src/component/SelectorProfileBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import {
  BattleGame,
  BattleGameChange,
  BattleGameUpdate,
} from "src/models/BattleGame";
import { Colors } from "src/style/Colors";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { sendNotification } from "src/api/notification";
import { ICardImage } from "src/component/card/CardImage";
import { FavoriteSelectAvatarBlock } from "src/component/FavoriteBlock";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { HistoryGameModal } from "src/component/modal/HistoryGameModal";
import { SearchThemeSelectScrollBlock } from "src/component/scroll/SearchThemeScrollBlock";
import { useAppBar } from "src/context/AppBarProvider";
import { NotificationType } from "src/models/enum/NotificationType";
import { Profile } from "src/models/Profile";
import { weightedRandom } from "src/utils/random";

export default function BattlePage() {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { user } = useAuth();
  const { top } = useAppBar();
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
          const game = data as BattleGame;
          setGame(game);
          setOpenModalFriend(game.player2 === null);
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
          },
          (payload) => {
            const id = payload.old.id;
            if (game.id === id) {
              navigate(`/`);
            }
          }
        )
        .subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, [deleteGame, game, navigate]);

  useEffect(() => {
    return () => {
      deleteGame();
    };
  }, []);

  const updateGame = (value: BattleGameUpdate) => {
    updateBattleGameByUuid(value).then(({ data }) => {
      setGame(data);
    });
  };

  const selectTheme = useCallback(
    async (theme: ICardImage) => {
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
      const distinctTheme = [...game.themesplayer2, ...game.themesplayer1];
      const games = [...game.games];
      const cumuls = distinctTheme.map((el) => {
        const nbGames = games.filter((g) => g.theme.id === el);
        return nbGames.length;
      });
      const index = weightedRandom(cumuls);
      const themeRandom = distinctTheme[index];
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
    if (game?.game) {
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

  const onValidOpponent = (profileOpponent: Profile) => {
    setOpenModalFriend(false);
    if (uuidGame) {
      updateGame({
        uuid: uuidGame,
        player2: profileOpponent.id,
      });
      sendNotification(NotificationType.battle_request, {
        uuid: uuidGame,
        user: profileOpponent,
      });
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
      className="page"
    >
      <Helmet>
        <title>{`${t("pages.battle.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation
        title="Jouer"
        quit={() => {
          deleteGame();
          navigate("/");
        }}
      />
      {game && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "background.paper",
            position: "sticky",
            top: top,
            left: 0,
            right: 0,
            zIndex: 2,
            p: 1,
          }}
        >
          <Container maxWidth="md">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: percent(100),
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
                label={t("commun.selectopponent")}
                profile={game.player2 ?? undefined}
                onChange={() => setOpenModalFriend(true)}
                score={game.scoreplayer2}
                ready={game.readyplayer2}
                left
              />
            </Box>
            <Divider sx={{ borderBottomWidth: 5 }} />
          </Container>
        </Box>
      )}
      <Box sx={{ width: percent(100), p: 1, overflow: "hidden" }}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ marginBottom: px(125) }}
        >
          {game && (
            <Grid size={12}>
              <Grid container spacing={1} justifyContent="center">
                <Grid size={12}>
                  <SelectedTheme
                    avatars={avatars}
                    select={(t) => selectTheme(t)}
                  />
                </Grid>
                <Grid size={12}>
                  <FavoriteSelectAvatarBlock
                    select={(t) => selectTheme(t)}
                    avatars={avatars}
                  />
                </Grid>
                <Grid size={12}>
                  <SearchThemeSelectScrollBlock
                    onSelect={(v) => selectTheme(v)}
                    search={""}
                    avatars={avatars}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "background.paper",
            zIndex: 10,
          }}
        >
          <Container maxWidth="md">
            <Box
              sx={{ p: 1, display: "flex", gap: 1, flexDirection: "column" }}
            >
              {game && game.games.length > 0 && (
                <ButtonColor
                  value={Colors.blue}
                  label={t("commun.gamehistory")}
                  variant="contained"
                  onClick={getHistory}
                  endIcon={<HistoryIcon />}
                />
              )}
              <ButtonColor
                value={isReady ? Colors.green : Colors.red}
                label={t("commun.ready")}
                variant="contained"
                onClick={ready}
                sx={{ p: px(10) }}
                typography="h2"
                endIcon={
                  isReady ? (
                    <CheckIcon sx={{ width: 30, height: 30 }} />
                  ) : (
                    <CloseIcon sx={{ width: 30, height: 30 }} />
                  )
                }
              />
            </Box>
          </Container>
        </Box>
        <SelectFriendModal
          title={t("commun.selectopponent")}
          open={openModalFriend}
          close={() => {
            deleteGame();
            navigate(-1);
          }}
          onValid={onValidOpponent}
        />
        {game?.player2 && (
          <HistoryGameModal
            open={isOpenHistory}
            close={() => setIsOpenHistory(false)}
            game={game}
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
}
