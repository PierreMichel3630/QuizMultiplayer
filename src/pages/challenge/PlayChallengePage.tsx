import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import { QuestionSolo } from "src/models/Question";

import { Box, Container, Typography } from "@mui/material";
import { percent } from "csx";
import { endChallenge, selectChallengeGameByUuid } from "src/api/challenge";
import { ImageCard } from "src/component/image/ImageCard";
import { LoadingDot } from "src/component/Loading";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { AnswerUser, Response } from "src/component/question/ResponseBlock";
import { ChallengeGame } from "src/models/Challenge";
import { Colors } from "src/style/Colors";

import challengeIcon from "src/assets/challenge.png";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { useUser } from "src/context/UserProvider";
import { decryptToNumber } from "src/utils/crypt";
import { preloadAllImages } from "src/utils/preload";
import { getResponse, verifyResponseCrypt } from "src/utils/response";

export default function PlayChallengePage() {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { language } = useUser();
  const navigate = useNavigate();

  const DELAY_START = 500;
  const DELAY_BETWEEN_QUESTION = 1000;

  const [questions, setQuestions] = useState<Array<QuestionSolo>>([]);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [timeoutQuestion, setTimeoutQuestion] = useState<
    string | number | NodeJS.Timeout | undefined
  >(undefined);

  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setWrongAnswer] = useState<number>(0);

  const [isEnd, setIsEnd] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [blockerState, setBlockerState] = useState<ReturnType<
    typeof useBlocker
  > | null>(null);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const numberQuestions = useMemo(
    () => correctAnswer + wrongAnswer,
    [correctAnswer, wrongAnswer]
  );

  const validateResponse = (value?: AnswerUser) => {
    clearTimeout(timeoutQuestion);
    setTimer(undefined);
    const myResponseValue = value?.value ?? undefined;
    if (question && language && uuidGame) {
      const result = value
        ? verifyResponseCrypt(question, language, value)
        : false;
      const response = getResponse(question, language);
      const questionsgame: Array<unknown> = JSON.parse(
        localStorage.getItem(uuidGame) ?? "[]"
      );
      questionsgame.push({
        ...question,
        response: response,
        resultPlayer1: result,
        responsePlayer1: myResponseValue,
      });
      localStorage.setItem(uuidGame, JSON.stringify(questionsgame));
      setCorrectAnswer((prev) => (result ? prev + 1 : prev));
      setWrongAnswer((prev) => (result ? prev : prev + 1));
      setResponse({
        answer: response,
        result: result,
        responsePlayer1: myResponseValue,
        resultPlayer1: result,
      });
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

  const end = useCallback(() => {
    if (uuidGame) {
      setIsEnd(true);
      blockerState?.reset?.();
      const questionsgame: Array<unknown> = JSON.parse(
        localStorage.getItem(uuidGame) ?? "[]"
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
    }
  }, [blockerState, navigate, uuidGame]);

  useEffect(() => {
    if (question) {
      setTimer(question.time);
      const newtimeoutQuestion = setTimeout(async () => {
        if (question && uuidGame) {
          const result = false;
          const response = decryptToNumber(question.response);
          const questionsgame: Array<unknown> = JSON.parse(
            localStorage.getItem(uuidGame) ?? "[]"
          );
          questionsgame.push({
            ...question,
            response: response,
            resultPlayer1: result,
            responsePlayer1: undefined,
          });
          localStorage.setItem(uuidGame, JSON.stringify(questionsgame));
          setCorrectAnswer((prev) => (result ? prev + 1 : prev));
          setWrongAnswer((prev) => (result ? prev : prev + 1));
          setResponse({
            answer: response,
            result: result,
            responsePlayer1: undefined,
            resultPlayer1: result,
          });
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
      }, question.time * 1000);
      setTimeoutQuestion(newtimeoutQuestion);
    } else {
      setTimer(undefined);
    }
  }, [end, question, questions, uuidGame]);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectChallengeGameByUuid(uuidGame).then(({ data }) => {
          const challengeGame = data as ChallengeGame;
          const questions = challengeGame.challenge.questionsv2;
          const hasgame = localStorage.getItem(uuidGame) !== null;
          if (hasgame) {
            const questionsgame = JSON.parse(
              localStorage.getItem(uuidGame) ?? "[]"
            ) as Array<QuestionSolo>;
            const indexNextQuestion = questionsgame.length;
            setResponse(undefined);
            const correct = [...questionsgame].reduce(
              (acc, el) => (el.resultPlayer1 === true ? acc + 1 : acc),
              0
            );
            const wrong = [...questionsgame].reduce(
              (acc, el) => (el.resultPlayer1 === false ? acc + 1 : acc),
              0
            );
            setCorrectAnswer(correct);
            setWrongAnswer(wrong);
            setQuestions(questions);
            if (indexNextQuestion < questions.length - 1) {
              setQuestion(questions[indexNextQuestion] as QuestionSolo);
            } else {
              navigate(`/challenge/game/${uuidGame}`, {
                state: {
                  previousPath: "/challenge",
                },
              });
            }
          } else {
            setQuestions(questions);
            const images = [...questions]
              .filter((el) => el.image !== undefined)
              .map((el) => el.image as string);
            preloadAllImages(images).then(() => {
              setTimeout(() => {
                setQuestion(questions[0]);
              }, DELAY_START);
            });
          }
        });
      }
    };
    getGame();
  }, [uuidGame]);

  const shouldBlock = useCallback(() => !isEnd, [isEnd]);
  const blocker = useBlocker(shouldBlock);

  if (blocker.state === "blocked" && !openConfirmModal) {
    setOpenConfirmModal(true);
    setBlockerState(blocker);
  }

  const handleConfirm = () => {
    setOpenConfirmModal(false);
    end();
  };

  const handleCancel = () => {
    setOpenConfirmModal(false);
    blockerState?.reset?.();
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
              <Typography variant="h4">{t("commun.loadimage")}</Typography>
              <LoadingDot />
            </Box>
          )}
        </Box>
      </Box>
      <ConfirmDialog
        title={t("modal.quitchallenge")}
        text={t("modal.quitchallengetext")}
        open={openConfirmModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </Container>
  );
}
