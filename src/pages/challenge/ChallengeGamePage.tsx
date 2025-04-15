import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Colors } from "src/style/Colors";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { selectChallengeGameByUuid } from "src/api/challenge";
import { ButtonColor } from "src/component/Button";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { ChallengeGame } from "src/models/Challenge";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { StreakChallengeModal } from "src/component/modal/StreakChallengeModal";
import { HeaderProfile } from "src/component/profile/HeaderProfile";
import { useAuth } from "src/context/AuthProviderSupabase";

export default function ChallengeGamePage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const { setStreak } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [game, setGame] = useState<undefined | ChallengeGame>(undefined);
  const [streakChallenge, setStreakChallenge] = useState<undefined | number>(
    undefined
  );

  useEffect(() => {
    const getGame = () => {
      if (uuid) {
        selectChallengeGameByUuid(uuid).then(({ data }) => {
          const challengeGame = data as ChallengeGame;
          setGame(challengeGame);
        });
      }
    };
    getGame();
  }, [uuid]);

  useEffect(() => {
    if (game && location.state !== null && location.state.isEnd === true) {
      const streak = game.profile.streak;
      setStreak(streak);
      setStreakChallenge(streak);
    }
  }, [location, game, setStreak]);

  return (
    <Grid
      container
      sx={{ minHeight: viewHeight(100) }}
      alignContent="flex-start"
    >
      <Helmet>
        <title>{`${t("commun.daychallenge")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("commun.daychallenge")} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {game && (
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <HeaderProfile profile={game.profile} />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <QuestionMarkIcon />
                  <Typography variant="h4" noWrap>
                    {game.score} / {NUMBER_QUESTIONS_CHALLENGE}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="h4" noWrap>
                    {(game.time / 1000).toFixed(2)}s
                  </Typography>
                </Grid>
                {game.questions.map((el, index) => (
                  <Fragment key={index}>
                    <Grid item xs={12}>
                      <CardSignalQuestion question={el} />
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
                  </Fragment>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              flexDirection: "column",
            }}
          >
            <ButtonColor
              value={Colors.blue}
              label={t("commun.return")}
              icon={KeyboardReturnIcon}
              onClick={() => {
                const path =
                  location.state !== null && location.state.previousPath;
                navigate(path ? location.state.previousPath : "/challenge");
              }}
              variant="contained"
            />
          </Box>
        </Container>
      </Box>
      {streakChallenge !== undefined && (
        <StreakChallengeModal
          close={() => setStreakChallenge(undefined)}
          streak={streakChallenge}
        />
      )}
    </Grid>
  );
}
