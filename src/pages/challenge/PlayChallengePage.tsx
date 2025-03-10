import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";
import { ResponseSolo } from "src/models/Response";

import { Box, Container, Typography } from "@mui/material";
import { percent, viewHeight } from "csx";
import {
  getQuestionChallenge,
  getResponseQuestionChallenge,
  selectChallengeGameByUuid,
} from "src/api/challenge";
import { ImageCard } from "src/component/image/ImageCard";
import { LoadingDot } from "src/component/Loading";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { ChallengeGame } from "src/models/Challenge";
import { StatusGameChallenge } from "src/models/enum/StatusGame";
import { Colors } from "src/style/Colors";
import { PreloadImages } from "src/utils/preload";

import challengeIcon from "src/assets/challenge.png";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";

export default function PlayChallengePage() {
  const { t } = useTranslation();
  const { language, sound } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<undefined | ChallengeGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [timeoutQuestion, setTimeoutQuestion] = useState<
    string | number | NodeJS.Timeout | undefined
  >(undefined);
  const [images, setImages] = useState<Array<string>>([]);
  const [myresponse, setMyresponse] = useState<string | number | undefined>(
    undefined
  );

  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setWrongAnswer] = useState<number>(0);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectChallengeGameByUuid(uuidGame).then(({ data }) => {
          setGame(data);
        });
      }
    };
    getGame();
  }, [uuidGame]);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const generateQuestion = useCallback(
    (game: undefined | ChallengeGame, delay: number) => {
      if (game) {
        getQuestionChallenge(game.uuid).then(({ data }) => {
          const questionSolo = data as QuestionSolo;
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

          let audio: HTMLAudioElement | undefined = undefined;
          if (questionSolo.audio) {
            audio = new Audio(questionSolo.audio);
            audio.load();
          }

          setTimeout(async () => {
            if (audio) {
              setAudio(audio);
            }
            setQuestion(questionSolo);
            setTimer(questionSolo.time - 1);
            setResponse(undefined);
            scrollTop();
            const newtimeoutQuestion = setTimeout(async () => {
              const response = await getResponseQuestionChallenge({
                game: game.uuid,
                response: undefined,
              });
              const res = response.data as ResponseSolo;
              setTimer(undefined);
              setResponse(res);
              setWrongAnswer((prev) => prev + 1);
              scrollTop();
              generateQuestion(game, 500);
              if (audio) {
                audio.pause();
              }
            }, questionSolo.time * 1000);
            setTimeoutQuestion(newtimeoutQuestion);
          }, delay);
        });
      }
    },
    []
  );

  const validateResponse = useCallback(
    async (value: Answer) => {
      const myResponseValue = value ? value.value : undefined;
      setMyresponse(myResponseValue);
      setTimer(undefined);
      clearTimeout(timeoutQuestion);
      if (game && language) {
        const { data } = await getResponseQuestionChallenge({
          game: game.uuid,
          response: myResponseValue,
          language: language.iso,
          exact: value ? value.exact : undefined,
        });
        const res = data as ResponseSolo;
        setMyresponse(undefined);
        setTimer(undefined);
        setResponse(res);
        scrollTop();
        generateQuestion(game, 500);
        if (res.result) {
          setCorrectAnswer((prev) => prev + 1);
        } else {
          setWrongAnswer((prev) => prev + 1);
        }
        if (audio) {
          audio.pause();
        }
      }
    },
    [audio, game, generateQuestion, language, timeoutQuestion]
  );

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectChallengeGameByUuid(uuidGame).then(({ data }) => {
          if (data !== null) {
            const res = data as ChallengeGame;
            if (res.status === StatusGameChallenge.END) {
              navigate(`/game/challenge/${res.uuid}`);
            } else {
              setGame(res);
              generateQuestion(res, 500);
            }
          } else {
            navigate("/");
          }
        });
      }
    };
    getGame();
  }, [generateQuestion, navigate, uuidGame]);

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio, sound]);

  const responseP1 = useMemo(
    () => myresponse ?? (response ? response.responseplayer1 : undefined),
    [myresponse, response]
  );

  const numberQuestions = useMemo(
    () => correctAnswer + wrongAnswer,
    [correctAnswer, wrongAnswer]
  );

  useEffect(() => {
    if (numberQuestions >= NUMBER_QUESTIONS_CHALLENGE) {
      navigate(`/game/challenge/${uuidGame}`);
    }
  }, [numberQuestions, navigate, uuidGame]);

  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: viewHeight(100),
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
            flex: "1 1 0",
            p: 1,
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ImageCard
              value={{
                image: challengeIcon,
                color: Colors.blue,
              }}
              size={80}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h2">{t("commun.daychallenge")}</Typography>
              <Typography variant="h2">
                {correctAnswer} / {numberQuestions}
              </Typography>
            </Box>
          </Box>
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
            {question ? (
              <QuestionResponseBlock
                responseplayer1={responseP1}
                response={response}
                question={question}
                onSubmit={validateResponse}
                timer={timer}
              />
            ) : (
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
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
