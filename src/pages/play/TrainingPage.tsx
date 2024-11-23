import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useMemo, useState } from "react";
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
import {
  MyResponse,
  ResponseLanguage,
  ResponseTraining,
} from "src/models/Response";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LastPageIcon from "@mui/icons-material/LastPage";
import { percent, px, viewHeight } from "csx";
import { ButtonColor } from "src/component/Button";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { LoadingDot } from "src/component/Loading";
import { ReportModal } from "src/component/modal/ReportModal";
import { QcmResponseTrainingBlock } from "src/component/QcmBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame, TrainingGame } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { PreloadImages } from "src/utils/preload";
import { verifyResponse } from "src/utils/response";

export default function TrainingPage() {
  const { t } = useTranslation();
  const { sound, language } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<undefined | TrainingGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionTraining>(
    undefined
  );
  const [nextQuestion, setNextQuestion] = useState<
    undefined | QuestionTraining
  >(undefined);
  const [questionReport, setQuestionReport] = useState<undefined | Question>(
    undefined
  );
  const [questions, setQuestions] = useState<Array<QuestionTraining>>([]);
  const [response, setResponse] = useState<undefined | ResponseTraining>(
    undefined
  );
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [goNext, setGoNext] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isAllQuestion, setIsAllQuestion] = useState(false);
  const [isNextAllQuestion, setIsNextAllQuestion] = useState(false);
  const [numberQuestions, setNumberQuestions] = useState(0);
  const [goodAnswer, setGoodAnswer] = useState(0);
  const [myresponse, setMyresponse] = useState<string | number | undefined>(
    undefined
  );
  const [images, setImages] = useState<Array<string>>([]);
  const [maxIndex, setMaxIndex] = useState(5);

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
  }, [audio, sound]);

  const getQuestion = (uuid: string, isfirstquestion = false) => {
    setMyresponse(undefined);
    setIsLoadingQuestion(true);
    getQuestionTrainingGame(uuid).then(({ data }) => {
      if (data) {
        const questionSolo = data as QuestionTraining;
        let urls: Array<string> = [];
        if (questionSolo.image) {
          urls = [...urls, questionSolo.image];
        }
        if (questionSolo.typequestion === "IMAGE") {
          const images = questionSolo.responses.reduce(
            (acc, v) => (v.image ? [...acc, v.image] : acc),
            [] as Array<string>
          );
          urls = [...urls, ...images];
        }
        setImages(urls);
        setNextQuestion(questionSolo);
        setIsAllQuestion(false);
        if (isfirstquestion) {
          setTimeout(() => {
            setQuestion(questionSolo);
            if (questionSolo.audio) {
              const audio = new Audio(questionSolo.audio);
              audio.play();
              setAudio(audio);
            }
            setResponse(undefined);
            setIsLoading(false);
          }, 1500);
        }
      } else {
        setIsEnd(true);
        setIsNextAllQuestion(true);
      }
      setIsLoadingQuestion(false);
    });
  };

  const validateResponse = async (value: MyResponse) => {
    const myResponseValue = value.value;
    setNextQuestion(undefined);
    setMyresponse(myResponseValue);
    if (question) {
      let result = false;
      if (question.isqcm) {
        result = Number(question.response) === Number(value);
      } else {
        const response = question.response as ResponseLanguage;
        result = verifyResponse(
          response[language.iso],
          myResponseValue,
          question.exact ? question.exact : value.exact
        );
      }
      setQuestions((prev) => [
        {
          ...question,
          resultPlayer1: result,
          responsePlayer1: myResponseValue,
        },
        ...prev,
      ]);
      setGoodAnswer((prev) => (result ? prev + 1 : prev));
      setNumberQuestions((prev) => prev + 1);
      setResponse({
        response: question.response,
        result: result,
        answer: myResponseValue,
      });
      setMyresponse(undefined);
      if (game) getQuestion(game.uuid);
    }
    if (audio) {
      audio.pause();
    }
  };

  const changeQuestion = () => {
    setGoNext(true);
  };

  useEffect(() => {
    if (goNext && nextQuestion && isLoadingQuestion === false) {
      setQuestion(nextQuestion);
      if (nextQuestion.audio) {
        const audio = new Audio(nextQuestion.audio);
        audio.play();
        setAudio(audio);
      }
      setResponse(undefined);
      setIsLoading(false);
      setGoNext(false);
      setNextQuestion(undefined);
    }
  }, [goNext, nextQuestion, isLoadingQuestion, isNextAllQuestion]);

  const quit = () => {
    setIsEnd(true);
  };

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectTrainingGameById(uuidGame).then(({ data }) => {
          if (data !== null) {
            setGame(data as SoloGame);
            getQuestion(uuidGame, true);
          } else {
            navigate("/");
          }
        });
      }
    };
    getGame();
  }, [navigate, uuidGame]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsLoading(true);
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
          document.documentElement.offsetHeight ||
        questions.length <= maxIndex
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 2);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [questions, maxIndex]);

  const questionsDisplay = useMemo(() => {
    return [...questions].splice(0, maxIndex);
  }, [questions, maxIndex]);

  return (
    <Box
      sx={{
        backgroundColor: Colors.black,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: isEnd ? "auto" : viewHeight(100),
          minHeight: isEnd ? viewHeight(100) : "auto",
          p: 0,
        }}
      >
        <Helmet>
          <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
        </Helmet>
        <PreloadImages urls={images} />

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
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      {questionsDisplay.map((el, index) => (
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
                          onClick={() =>
                            game
                              ? navigate(`/theme/${game.theme.id}`)
                              : navigate(-1)
                          }
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
                  (question === undefined ||
                    (question && response) ||
                    isEnd) && (
                    <Box sx={{ display: "flex", width: percent(100) }}>
                      <Grid container spacing={1}>
                        {!isEnd && (
                          <Grid item xs={12}>
                            <ButtonColor
                              value={Colors.blue2}
                              label={t("commun.nextquestion")}
                              icon={LastPageIcon}
                              onClick={() => changeQuestion()}
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
    </Box>
  );
}
