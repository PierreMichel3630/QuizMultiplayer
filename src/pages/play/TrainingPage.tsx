import { Box, Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionTrainingGame, selectTrainingGameById } from "src/api/game";
import { useUser } from "src/context/UserProvider";
import { QuestionTraining } from "src/models/Question";

import { percent } from "csx";
import { ButtonColor } from "src/component/Button";
import { LoadingDot } from "src/component/Loading";
import { EndTrainingGameBlock } from "src/component/play/training/EndTrainingGameBlock";
import { HeaderTrainingGame } from "src/component/play/training/HeaderTrainingGame";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { SoloGame, TrainingGame } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { PreloadImages } from "src/utils/preload";
import { getResponse, verifyResponseCrypt } from "src/utils/response";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LastPageIcon from "@mui/icons-material/LastPage";

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
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [goNext, setGoNext] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isAllQuestion, setIsAllQuestion] = useState(false);
  const [isNextAllQuestion, setIsNextAllQuestion] = useState(false);
  const [goodAnswer, setGoodAnswer] = useState(0);
  const [badAnswer, setBadAnswer] = useState(0);
  const [images, setImages] = useState<Array<string>>([]);

  const localStorageId = useMemo(() => `game-training-${uuidGame}`, [uuidGame]);

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
  }, [audio, sound]);

  const getQuestion = useCallback((uuid: string, isfirstquestion = false) => {
    const questionsgame: Array<unknown> = JSON.parse(
      localStorage.getItem(`game-training-${uuid}`) ?? "[]"
    );
    setIsLoadingQuestion(true);
    getQuestionTrainingGame(uuid, questionsgame).then(({ data }) => {
      if (data) {
        const questionSolo = data as QuestionTraining;
        let urls: Array<string> = [];
        if (questionSolo.image) {
          urls = [...urls, questionSolo.image];
        }
        if (questionSolo.typequestion === "IMAGE") {
          const images = questionSolo.answers.reduce(
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
  }, []);

  const validateResponse = async (value: Answer) => {
    const myResponseValue = value.value;
    setNextQuestion(undefined);
    if (question && language) {
      const result = verifyResponseCrypt(question, language, value);
      const response = getResponse(question, language);
      const questionsgame: Array<unknown> = JSON.parse(
        localStorage.getItem(localStorageId) ?? "[]"
      );
      questionsgame.push({
        ...question,
        response: response,
        resultPlayer1: result,
        responsePlayer1: myResponseValue,
      });
      localStorage.setItem(localStorageId, JSON.stringify(questionsgame));
      setGoodAnswer((prev) => (result ? prev + 1 : prev));
      setBadAnswer((prev) => (result ? prev : prev + 1));
      setResponse({
        answer: response,
        result: result,
        responsePlayer1: myResponseValue,
        resultPlayer1: result,
      });
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
  }, [getQuestion, navigate, uuidGame]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

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
        <HeaderTrainingGame
          theme={game?.theme}
          goodAnswer={goodAnswer}
          badAnswer={badAnswer}
        />
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
          {isLoading ? (
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
              <Typography variant="h4">{t("commun.launchpartie")}</Typography>
              <LoadingDot />
            </Box>
          ) : (
            <>
              {isEnd ? (
                <EndTrainingGameBlock
                  game={game}
                  isAllQuestion={isAllQuestion}
                />
              ) : (
                <>
                  <QuestionResponseBlock
                    response={response}
                    question={question}
                    onSubmit={validateResponse}
                  />
                  {(question === undefined ||
                    (question && response) ||
                    isEnd) && (
                    <Box
                      sx={{
                        display: "flex",
                        width: percent(100),
                      }}
                    >
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
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
