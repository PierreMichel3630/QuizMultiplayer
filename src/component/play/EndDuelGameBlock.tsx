import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import BoltIcon from "@mui/icons-material/Bolt";
import HomeIcon from "@mui/icons-material/Home";
import { px } from "csx";
import { useNavigate } from "react-router-dom";
import { launchDuelGame, matchmakingDuelGame } from "src/api/game";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import ReplayIcon from "@mui/icons-material/Replay";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { QuestionResult } from "src/models/Question";
import { CardSignalQuestion } from "../card/CardQuestion";
import { ExperienceDuelBlock } from "../ExperienceBlock";
import { ReportModal } from "../modal/ReportModal";
import { AddMoneyBlock } from "../MoneyBlock";
import { RankingTableSoloDuel } from "../table/RankingTable";
import { ProfileTitleBlock } from "../title/ProfileTitle";

interface Props {
  game: DuelGame;
}

export const EndDuelGameBlock = ({ game }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uuid, language } = useUser();
  const { user } = useAuth();
  const { refreshProfil } = useAuth();
  const { getMyAccomplishments } = useApp();

  const [question, setQuestion] = useState<QuestionResult | undefined>(
    undefined
  );

  useEffect(() => {
    refreshProfil();
  }, []);

  const gamebattle = useMemo(() => game.battlegame, [game]);
  const isPlayer1 = useMemo(() => game.player1.id === uuid, [uuid, game]);
  const isPlayer2 = useMemo(() => game.player2?.id === uuid, [uuid, game]);

  const resultPlayer1 = useMemo(() => {
    const draw = game.ptsplayer1 === game.ptsplayer2;
    return draw ? 0.5 : game.ptsplayer1 > game.ptsplayer2 ? 1 : 0;
  }, [game]);

  const resultPlayer2 = useMemo(() => {
    const draw = game.ptsplayer1 === game.ptsplayer2;
    return draw ? 0.5 : game.ptsplayer2 > game.ptsplayer1 ? 1 : 0;
  }, [game]);

  const hasWin = useMemo(
    () =>
      isPlayer1
        ? game.ptsplayer1 > game.ptsplayer2
        : game.ptsplayer2 > game.ptsplayer1,
    [isPlayer1, game]
  );
  const equality = useMemo(() => game.ptsplayer2 === game.ptsplayer1, [game]);
  const money = useMemo(
    () =>
      isPlayer1
        ? game.ptsplayer1 / 2
        : isPlayer2
        ? game.ptsplayer2 / 2
        : undefined,
    [game, isPlayer1, isPlayer2]
  );

  const revenge = () => {
    const player1 = isPlayer1 ? game.player1.id : game.player2?.id;
    const player2 = isPlayer1 ? game.player2?.id : game.player1.id;
    if (player1 && player2) {
      launchDuelGame(player1, player2, game.theme.id).then(({ data }) => {
        if (data) {
          navigate(`/duel/${data.uuid}`, {});
        }
      });
    }
  };

  const playDuel = async () => {
    if (user) {
      if (uuid && language) {
        const { data } = await matchmakingDuelGame(
          uuid,
          game.theme.id,
          language
        );
        navigate(`/duel/${data.uuid}`);
      }
    } else {
      navigate(`/login`);
    }
  };

  const deltaEloPlayer1 = useMemo(() => {
    let elo = 0;
    if (game.ptsplayer1 > game.ptsplayer2) {
      elo = game.elo.deltaPlayer1.win;
    } else if (game.ptsplayer2 > game.ptsplayer1) {
      elo = game.elo.deltaPlayer1.lose;
    } else {
      elo = game.elo.deltaPlayer1.draw;
    }
    return elo;
  }, [game]);

  const deltaEloPlayer2 = useMemo(() => {
    let elo = 0;
    if (game.ptsplayer1 > game.ptsplayer2) {
      elo = game.elo.deltaPlayer2.lose;
    } else if (game.ptsplayer2 > game.ptsplayer1) {
      elo = game.elo.deltaPlayer2.win;
    } else {
      elo = game.elo.deltaPlayer2.draw;
    }
    return elo;
  }, [game]);

  const getColorElo = useCallback((elo: number) => {
    let color = Colors.white;
    if (elo > 0) {
      color = Colors.green;
    } else if (elo < 0) {
      color = Colors.red;
    }
    return color;
  }, []);

  return (
    <Box sx={{ mb: gamebattle !== null ? px(50) : px(140) }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box sx={{ width: px(70) }}>
            <ImageThemeBlock theme={game.theme} />
          </Box>
          <Typography variant="h2" sx={{ wordBreak: "break-all" }}>
            {game.theme.title}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1">
            {equality
              ? t("commun.equality")
              : hasWin
              ? t("commun.win")
              : t("commun.loose")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography
              variant="h2"
              sx={{ color: Colors.colorDuel1, fontSize: 35 }}
            >
              {game.ptsplayer1}
            </Typography>
            <AvatarAccountBadge
              profile={game.player1}
              size={60}
              color={Colors.colorDuel1}
            />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Typography variant="h4" sx={{ color: Colors.colorDuel1 }}>
              {game.player1.username}
            </Typography>
            <ProfileTitleBlock titleprofile={game.player1.titleprofile} />
            <Box>
              <Typography variant="h6" component="span">
                {game.elo.eloPlayer1 + deltaEloPlayer1} {t("commun.points")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: getColorElo(deltaEloPlayer1),
                }}
                component="span"
              >
                {` (${deltaEloPlayer1 > 0 ? "+" : ""}${deltaEloPlayer1})`}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BoltIcon sx={{ fontSize: 50, color: "text.primary" }} />
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          {game.player2 && (
            <>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <AvatarAccountBadge
                  profile={game.player2}
                  size={60}
                  color={Colors.colorDuel2}
                />
                <Typography
                  variant="h2"
                  sx={{ color: Colors.colorDuel2, fontSize: 35 }}
                >
                  {game.ptsplayer2}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: Colors.colorDuel2 }}>
                  {game.player2.username}
                </Typography>
                <ProfileTitleBlock titleprofile={game.player2.titleprofile} />
                <Box>
                  <Typography variant="h6" component="span">
                    {game.elo.eloPlayer2 + deltaEloPlayer2} {t("commun.points")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: getColorElo(deltaEloPlayer2),
                    }}
                    component="span"
                  >
                    {` (${deltaEloPlayer2 > 0 ? "+" : ""}${deltaEloPlayer2})`}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Grid>
        {(isPlayer1 || isPlayer2) && (
          <Grid item xs={12}>
            <ExperienceDuelBlock
              score={isPlayer1 ? game.ptsplayer1 : game.ptsplayer2}
              victory={isPlayer1 ? resultPlayer1 === 1 : resultPlayer2 === 1}
            />
          </Grid>
        )}
        {money && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <AddMoneyBlock money={Math.round(money)} />
          </Grid>
        )}
        <Grid item xs={12}>
          <RankingTableSoloDuel theme={game.theme} max={3} mode="DUEL" />
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{
              borderBottomWidth: 5,
              borderColor: Colors.white,
              borderRadius: px(5),
            }}
          />
        </Grid>
        {[...game.questions].map((el) => (
          <Fragment key={el.id}>
            <Grid item xs={12}>
              <CardSignalQuestion
                question={el}
                report={() => setQuestion(el)}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider
                sx={{
                  borderBottomWidth: 3,
                  borderRadius: px(5),
                }}
              />
            </Grid>
          </Fragment>
        ))}
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              flexDirection: "column",
            }}
          >
            {gamebattle !== null ? (
              <ButtonColor
                value={Colors.blue}
                label={t("commun.return")}
                icon={KeyboardReturnIcon}
                onClick={() => navigate(`/battle/${gamebattle}`)}
                variant="contained"
              />
            ) : (
              <>
                <ButtonColor
                  value={Colors.red}
                  label={t("commun.replay")}
                  icon={ReplayIcon}
                  onClick={() => playDuel()}
                  variant="contained"
                />
                <ButtonColor
                  value={Colors.blue}
                  label={t("commun.revenge")}
                  icon={OfflineBoltIcon}
                  onClick={() => revenge()}
                  variant="contained"
                />
                <ButtonColor
                  value={Colors.green}
                  label={t("commun.returnhome")}
                  icon={HomeIcon}
                  onClick={() => {
                    getMyAccomplishments();
                    navigate("/");
                  }}
                  variant="contained"
                />
              </>
            )}
          </Box>
        </Container>
      </Box>
      <ReportModal
        open={question !== undefined}
        close={() => setQuestion(undefined)}
        question={question}
        duelgame={game}
      />
    </Box>
  );
};
