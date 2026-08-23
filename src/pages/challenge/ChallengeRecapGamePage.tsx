import { Box, Container, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Colors } from "src/style/Colors";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  selectChallengeById,
  selectChallengeGameAnswerById,
  selectChallengeGameByUuid,
  selectStatsChallengeById,
} from "src/api/challenge";
import { ButtonColor } from "src/component/Button";
import {
  Challenge,
  ChallengeGame,
  ChallengeGameAnswer,
  ChallengeQuestionStats,
  ExtraChallenge,
} from "src/models/Challenge";

import { ExtraBlock } from "src/component/extra/ExtraBlock";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { RankingChallengeResult } from "src/component/ranking/RankingChallenge";
import { QuestionResult } from "src/models/Question";

export default function ChallengeRecapGamePage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [game, setGame] = useState<undefined | ChallengeGame>(undefined);
  const [extra, setExtra] = useState<undefined | ExtraChallenge>(undefined);
  const [challenge, setChallenge] = useState<Challenge | undefined>(undefined);
  const [answers, setAnswers] = useState<Array<ChallengeGameAnswer>>([]);
  const [stats, setStats]= useState<Array<ChallengeQuestionStats>>([])

  const questions: Array<QuestionResult> = useMemo(() => {
    const questionsChallenge = challenge ? challenge.questionsv2 : [];
    return answers.length > 0 && questionsChallenge.length > 0
      ? answers.map((el) => {
          const questionPlayer = questionsChallenge.find(
            (q) => q.id === el.question,
          );
          return {
            ...questionPlayer,
            responsePlayer1: el.answer,
          } as QuestionResult;
        })
      : [];
  }, [challenge, answers]);

  const loadAnswers = (game: ChallengeGame) => {
    if (game) {
      selectChallengeById(game.challenge.id).then(({ data }) => {
        setChallenge(data);
      });
      selectChallengeGameAnswerById(game.id).then(({ data }) => {
        setAnswers(data ?? []);
      });
    }
  };

  const loadStats = (game: ChallengeGame) => {
    if (game) {
      selectStatsChallengeById(game.challenge.id).then(({ data }) => {
        setStats(data ?? [])
      });
    }
  };

  useEffect(() => {
    const getGame = () => {
      if (uuid) {
        selectChallengeGameByUuid(uuid).then(({ data }) => {
          const challengeGame = data as ChallengeGame;
          setGame(challengeGame);
          loadAnswers(challengeGame);
          loadStats(challengeGame);
        });
      }
    };
    getGame();
  }, [uuid]);

  useEffect(() => {
    if (location.state?.extra) {
      setExtra(location.state.extra as ExtraChallenge);
    }
  }, [location]);

  return (
    <Grid container className="page" alignContent="flex-start">
      <Helmet>
        <title>{`${t("commun.daychallenge")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {game && (
              <Grid container spacing={1}>
                {game.profile && (
                  <Grid size={12}>
                    <ProfileBlock profile={game.profile} />
                  </Grid>
                )}
                {extra && (
                  <>
                    <Grid size={12}>
                      <ExtraBlock value={extra} />
                    </Grid>
                    <Grid size={12}>
                      <Divider sx={{ borderBottomWidth: 5 }} />
                    </Grid>
                  </>
                )}
                <Grid size={12}>
                  <RankingChallengeResult />
                </Grid>
                {questions.map((el, index) => (
                  <Fragment key={index}>
                    <Grid size={12}>
                      <CardSignalQuestion
                        question={el}
                        stats={stats}
                        version={game.version}
                      />
                    </Grid>
                    <Grid size={12}>
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
    </Grid>
  );
}
