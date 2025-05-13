import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";

import { Box, Container, Typography } from "@mui/material";
import { percent, viewHeight } from "csx";
import { endChallenge, selectChallengeGameByUuid } from "src/api/challenge";
import { ImageCard } from "src/component/image/ImageCard";
import { LoadingDot } from "src/component/Loading";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { ChallengeGame } from "src/models/Challenge";
import { Colors } from "src/style/Colors";

import challengeIcon from "src/assets/challenge.png";
import { decryptToJsonLanguage } from "src/utils/crypt";
import { verifyResponse } from "src/utils/response";

export default function PlayChallengePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();

  const DELAY_BETWEEN_QUESTION = 500;

  const [questions, setQuestions] = useState<Array<QuestionSolo>>([]);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [timeoutQuestion, setTimeoutQuestion] = useState<
    string | number | NodeJS.Timeout | undefined
  >(undefined);
  const [myresponse, setMyresponse] = useState<string | number | undefined>(
    undefined
  );

  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setWrongAnswer] = useState<number>(0);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectChallengeGameByUuid(uuidGame).then(({ data }) => {
          const challengeGame = data as ChallengeGame;
          const questions = challengeGame.challenge.questions;
          setQuestions(questions);
          setTimeout(() => {
            setQuestion(questions[0]);
          }, DELAY_BETWEEN_QUESTION);
        });
      }
    };
    getGame();
  }, [uuidGame]);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const numberQuestions = useMemo(
    () => correctAnswer + wrongAnswer,
    [correctAnswer, wrongAnswer]
  );

  const localStorageId = useMemo(() => `challenge-${uuidGame}`, [uuidGame]);

  const validateResponse = (value?: Answer) => {
    clearTimeout(timeoutQuestion);
    setTimer(undefined);
    const myResponseValue = value?.value ?? undefined;
    setMyresponse(myResponseValue);
    if (question) {
      const result = value ? verifyResponse(language, question, value) : false;
      const response = decryptToJsonLanguage(question.response);
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
      setCorrectAnswer((prev) => (result ? prev + 1 : prev));
      setWrongAnswer((prev) => (result ? prev : prev + 1));
      setResponse({
        response: response,
        result: result,
        responsePlayer1: myResponseValue,
      });
      setMyresponse(undefined);
      setTimeout(() => {
        scrollTop();
        const indexNextQuestion = questionsgame.length;
        if (indexNextQuestion < questions.length) {
          setResponse(undefined);
          setQuestion(questions[indexNextQuestion]);
        } else {
          end();
        }
      }, DELAY_BETWEEN_QUESTION);
    }
  };

  const end = () => {
    if (uuidGame) {
      const questionsgame: Array<unknown> = JSON.parse(
        localStorage.getItem(localStorageId) ?? "[]"
      );
      endChallenge(questionsgame, uuidGame).then(({ data }) => {
        navigate(`/challenge/game/${uuidGame}`, {
          state: {
            previousPath: "/challenge",
            isEnd: true,
            extra: data,
          },
        });
      });
      localStorage.removeItem(localStorageId);
    }
  };

  const responseP1 = useMemo(
    () => myresponse ?? (response ? response.responsePlayer1 : undefined),
    [myresponse, response]
  );

  useEffect(() => {
    if (question) {
      setTimer(question.time);
      const newtimeoutQuestion = setTimeout(async () => {
        validateResponse();
      }, question.time * 1000);
      setTimeoutQuestion(newtimeoutQuestion);
    } else {
      setTimer(undefined);
    }
  }, [question]);

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
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            <Box></Box>
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
