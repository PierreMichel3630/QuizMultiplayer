import { Alert, Box, Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTrainingGame,
  getQuestionTrainingGame,
  selectTrainingGameById,
} from "src/api/game";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { QuestionSoloBlock } from "src/component/QuestionBlock";
import { ResponseTrainingBlock } from "src/component/ResponseBlock";
import { useUser } from "src/context/UserProvider";
import { QuestionTraining } from "src/models/Question";
import { ResponseTraining } from "src/models/Response";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LastPageIcon from "@mui/icons-material/LastPage";
import { percent, viewHeight } from "csx";
import { ButtonColor } from "src/component/Button";
import { LoadingDot } from "src/component/Loading";
import { QcmResponseTrainingBlock } from "src/component/QcmBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame, TrainingGame } from "src/models/Game";
import { Colors } from "src/style/Colors";

export const TrainingPage = () => {
  const { t } = useTranslation();
  const { sound } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<undefined | TrainingGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionTraining>(
    undefined
  );
  const [response, setResponse] = useState<undefined | ResponseTraining>(
    undefined
  );
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [numberQuestions, setNumberQuestions] = useState(0);
  const [goodAnswer, setGoodAnswer] = useState(0);

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
  }, [audio, sound]);

  const getQuestion = useCallback(() => {
    if (uuidGame) {
      getQuestionTrainingGame(uuidGame).then(({ data }) => {
        if (data) {
          const questionSolo = data as QuestionTraining;
          if (questionSolo.audio) {
            const audio = new Audio(questionSolo.audio);
            audio.play();
            setAudio(audio);
          }
          setQuestion(questionSolo);
          setResponse(undefined);
          setIsLoading(false);
        } else {
          setIsEnd(true);
          setIsLoading(false);
        }
      });
    }
  }, [uuidGame]);

  const validateResponse = async (value: string | number) => {
    if (question) {
      const result = question.response === value;
      setGoodAnswer((prev) => (result ? prev + 1 : prev));
      setNumberQuestions((prev) => prev + 1);
      setResponse({
        response: question.response,
        result: result,
        answer: value,
      });
    }
    if (audio) {
      audio.pause();
    }
  };

  const quit = () => {
    if (uuidGame) deleteTrainingGame(uuidGame);
    navigate(-1);
  };

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectTrainingGameById(uuidGame).then(({ data }) => {
          if (data !== null) {
            setGame(data as SoloGame);
            getQuestion();
          } else {
            navigate("/");
          }
        });
      }
    };
    getGame();
  }, [getQuestion, navigate, uuidGame]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  useEffect(() => {
    return () => {
      if (uuidGame) deleteTrainingGame(uuidGame);
    };
  }, [uuidGame]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
        p: 0,
        backgroundColor: Colors.black,
      }}
    >
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>

      <Box
        sx={{
          display: "flex",
          flex: "1 1 0",
          p: 1,
          flexDirection: "column",
          gap: 1,
        }}
      >
        {game && (
          <Box>
            <ScoreThemeBlock
              theme={game.theme}
              extra={
                numberQuestions > 0 ? (
                  <>
                    <Typography variant="h2" color="text.secondary">
                      {goodAnswer} / {numberQuestions}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      ({((goodAnswer / numberQuestions) * 100).toFixed(0)} %)
                    </Typography>
                  </>
                ) : undefined
              }
            />
          </Box>
        )}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            flex: "1 1 0",
            gap: 1,
            minHeight: 0,
          }}
        >
          {isEnd ? (
            <Box sx={{ display: "flex", width: percent(100) }}>
              <Alert severity="warning" sx={{ width: percent(100) }}>
                {t("alert.allresponseanswer")}
              </Alert>
            </Box>
          ) : (
            <>
              {question && (
                <>
                  <QuestionSoloBlock question={question} />
                  {question && question.isqcm ? (
                    <QcmResponseTrainingBlock
                      response={response}
                      question={question}
                      onSubmit={validateResponse}
                    />
                  ) : (
                    <>
                      {response ? (
                        <ResponseTrainingBlock response={response} />
                      ) : (
                        <InputResponseBlock onSubmit={validateResponse} />
                      )}
                    </>
                  )}
                </>
              )}
              {isLoading && (
                <Box
                  sx={{
                    flexGrow: 1,
                    flex: "1 1 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 1,
                    width: percent(100),
                  }}
                >
                  <Typography variant="h4" color="text.secondary">
                    {t("commun.launchpartie")}
                  </Typography>
                  <LoadingDot />
                </Box>
              )}
            </>
          )}
        </Box>
        {!isLoading &&
          (question === undefined || (question && response) || isEnd) && (
            <Box sx={{ display: "flex", width: percent(100) }}>
              <Grid container spacing={1}>
                {!isEnd && (
                  <Grid item xs={12}>
                    <ButtonColor
                      value={Colors.blue2}
                      label={t("commun.nextquestion")}
                      icon={LastPageIcon}
                      onClick={() => getQuestion()}
                      variant="contained"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <ButtonColor
                    value={Colors.red}
                    label={t("commun.leave")}
                    icon={ExitToAppIcon}
                    onClick={() => quit()}
                    variant="contained"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
      </Box>
    </Container>
  );
};
