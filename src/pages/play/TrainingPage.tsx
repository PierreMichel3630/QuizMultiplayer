import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTrainingGame,
  getQuestionTrainingGame,
  selectTrainingGameById,
} from "src/api/game";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { QuestionTrainingBlock } from "src/component/QuestionBlock";
import { ResponseTrainingBlock } from "src/component/ResponseBlock";
import { useUser } from "src/context/UserProvider";
import { Question, QuestionTraining } from "src/models/Question";
import { ResponseLanguage, ResponseTraining } from "src/models/Response";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LastPageIcon from "@mui/icons-material/LastPage";
import { percent, px, viewHeight } from "csx";
import { ButtonColor } from "src/component/Button";
import { LoadingDot } from "src/component/Loading";
import { QcmResponseTrainingBlock } from "src/component/QcmBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame, TrainingGame } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { verifyResponse } from "src/utils/response";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { ReportModal } from "src/component/modal/ReportModal";

export default function TrainingPage() {
  const { t } = useTranslation();
  const { sound, language } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<undefined | TrainingGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionTraining>(
    undefined
  );
  const [questionReport, setQuestionReport] = useState<undefined | Question>(
    undefined
  );
  const [questions, setQuestions] = useState<Array<QuestionTraining>>([]);
  const [response, setResponse] = useState<undefined | ResponseTraining>(
    undefined
  );
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isAllQuestion, setIsAllQuestion] = useState(false);
  const [numberQuestions, setNumberQuestions] = useState(0);
  const [goodAnswer, setGoodAnswer] = useState(0);
  const [myresponse, setMyresponse] = useState<string | number | undefined>(
    undefined
  );

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
  }, [audio, sound]);

  const getQuestion = useCallback(() => {
    setMyresponse(undefined);
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
          setIsAllQuestion(false);
        } else {
          setIsEnd(true);
          setIsAllQuestion(true);
          setIsLoading(false);
        }
      });
    }
  }, [uuidGame]);

  const validateResponse = async (value: string | number) => {
    setMyresponse(value);
    if (question) {
      let result = false;
      if (question.isqcm) {
        result = Number(question.response) === Number(value);
      } else {
        const response = question.response as ResponseLanguage;
        result = verifyResponse(response[language.iso], value, question.exact);
      }
      setQuestions((prev) => [
        ...prev,
        { ...question, resultPlayer1: result, responsePlayer1: value },
      ]);
      setGoodAnswer((prev) => (result ? prev + 1 : prev));
      setNumberQuestions((prev) => prev + 1);
      setResponse({
        response: question.response,
        result: result,
        answer: value,
      });
      setMyresponse(undefined);
    }
    if (audio) {
      audio.pause();
    }
  };

  const quit = () => {
    setIsEnd(true);
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
        height: isEnd ? "auto" : viewHeight(100),
        minHeight: isEnd ? viewHeight(100) : "auto",
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
          flex: isEnd ? "auto" : "1 1 0",
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
            flex: isEnd ? "auto" : "1 1 0",
            gap: 1,
            minHeight: 0,
          }}
        >
          {isEnd ? (
            <Box sx={{ display: "flex", width: percent(100), mb: 6 }}>
              <Grid container spacing={1}>
                {isAllQuestion && (
                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ width: percent(100) }}>
                      {t("alert.allresponseanswer")}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      borderBottomWidth: 5,
                      borderColor: Colors.white,
                      borderRadius: px(5),
                    }}
                  />
                  {questions.map((el, index) => (
                    <Fragment key={index}>
                      <Grid item xs={12}>
                        <CardSignalQuestion
                          question={el as Question}
                          report={() => setQuestionReport(el as Question)}
                        />
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
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <Container
                    maxWidth="lg"
                    sx={{
                      backgroundColor: Colors.black,
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
                        value={Colors.red}
                        label={t("commun.leave")}
                        icon={ExitToAppIcon}
                        onClick={() => navigate(-1)}
                        variant="contained"
                      />
                    </Box>
                  </Container>
                </Box>
              </Grid>
            </Box>
          ) : (
            <>
              {question && (
                <>
                  <QuestionTrainingBlock question={question} />
                  {question && question.isqcm ? (
                    <QcmResponseTrainingBlock
                      myresponse={myresponse}
                      response={response}
                      question={question}
                      onSubmit={validateResponse}
                    />
                  ) : (
                    <>
                      {response ? (
                        <ResponseTrainingBlock response={response} />
                      ) : (
                        <InputResponseBlock
                          myresponse={myresponse}
                          onSubmit={validateResponse}
                          typeResponse={question.typeResponse}
                        />
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
            </>
          )}
        </Box>
      </Box>
      <ReportModal
        open={questionReport !== undefined}
        close={() => setQuestionReport(undefined)}
        question={questionReport}
      />
    </Container>
  );
}
