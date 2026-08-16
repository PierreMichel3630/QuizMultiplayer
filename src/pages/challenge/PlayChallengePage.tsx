import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import { QuestionSolo } from "src/models/Question";

import { Box, Container, Typography } from "@mui/material";
import { percent } from "csx";
import { endChallenge, selectChallengeGameByUuid } from "src/api/challenge";
import { LoadingDot } from "src/component/Loading";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { AnswerUser, Response } from "src/component/question/ResponseBlock";
import { ChallengeGame } from "src/models/Challenge";

import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { HeaderChallengeGame } from "src/component/play/HeaderScore";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { DEFAULT_TIME_QUESTION } from "src/utils/config";
import { decryptToNumber } from "src/utils/crypt";
import { preloadAllImages } from "src/utils/preload";
import { getResponse, verifyResponseCrypt } from "src/utils/response";
import { shuffle } from "src/utils/sort";

export default function PlayChallengePage() {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { language } = useUser();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const DELAY_START = 500;
  const DELAY_BETWEEN_QUESTION = 1000;

  const [questions, setQuestions] = useState<Array<QuestionSolo>>([]);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [timeoutQuestion, setTimeoutQuestion] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setWrongAnswer] = useState<number>(0);

  const [isEnd, setIsEnd] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [blockerState, setBlockerState] = useState<ReturnType<
    typeof useBlocker
  > | null>(null);

  //Gestion du chrono
  const startTimeRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

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
        localStorage.getItem(uuidGame) ?? "[]",
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
      const indexNextQuestion = questionsgame.length;
      if (indexNextQuestion < questions.length) {
        setTimeout(() => {
          scrollTop();
          setResponse(undefined);
          setQuestion(questions[indexNextQuestion]);
        }, DELAY_BETWEEN_QUESTION);
      } else {
        end();
      }
    }
  };

  const end = useCallback(() => {
    if (uuidGame) {
      setRunning(false)
      const timedMs = Math.floor((Date.now() - startTimeRef.current!))

      setIsEnd(true);
      blockerState?.reset?.();
      const questionsgame: Array<unknown> = JSON.parse(
        localStorage.getItem(uuidGame) ?? "[]",
      );
      setTimeout(() => {
        endChallenge(questionsgame, uuidGame, timedMs).then(({ data }) => {
          navigate(`/challenge/game/${uuidGame}`, {
            state: {
              previousPath: "/challenge",
              isEnd: true,
              extra: data,
            },
          });
        });
      }, DELAY_BETWEEN_QUESTION * 2);
    }
  }, [blockerState, navigate, uuidGame]);

  useEffect(() => {
    let newtimeoutQuestion: number | undefined = undefined;
    if (question) {
      const time = Number(question.time);
      const timerTimeout = Number.isNaN(time)
        ? DEFAULT_TIME_QUESTION * 10000
        : time * 10000;
      setTimer(question.time);
      newtimeoutQuestion = setTimeout(async () => {
        if (question && uuidGame) {
          const result = false;
          const response = decryptToNumber(question.response);
          const questionsgame: Array<unknown> = JSON.parse(
            localStorage.getItem(uuidGame) ?? "[]",
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
          const indexNextQuestion = questionsgame.length;
          if (indexNextQuestion < questions.length) {
            setTimeout(() => {
              scrollTop();
              setResponse(undefined);
              setQuestion(questions[indexNextQuestion]);
            }, DELAY_BETWEEN_QUESTION);
          } else {
            end();
          }
        }
      }, timerTimeout);
      setTimeoutQuestion(newtimeoutQuestion);
    } else {
      setTimer(undefined);
    }

    return () => {
      clearTimeout(newtimeoutQuestion);
    };
  }, [end, question, questions, uuidGame]);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectChallengeGameByUuid(uuidGame).then(({ data }) => {
          const challengeGame = data as ChallengeGame;
          const questions = [...challengeGame.challenge.questionsv2].sort(
            shuffle,
          );
          const hasgame = safeGetStorage(uuidGame) !== null;
          if (hasgame) {
            const questionsgame = JSON.parse(
              localStorage.getItem(uuidGame) ?? "[]",
            ) as Array<QuestionSolo>;
            const idsQuestionsPlay = [...questionsgame].map((el) => el.id);
            const questionsNotPlay = [...questions].filter(
              (el) => !idsQuestionsPlay.includes(el.id),
            );
            const questionsPlay = [...questions].filter((el) =>
              idsQuestionsPlay.includes(el.id),
            );
            const questionsGame = [...questionsPlay, ...questionsNotPlay];
            const indexNextQuestion = questionsgame.length;
            setResponse(undefined);
            const correct = [...questionsgame].reduce(
              (acc, el) => (el.resultPlayer1 === true ? acc + 1 : acc),
              0,
            );
            const wrong = [...questionsgame].reduce(
              (acc, el) => (el.resultPlayer1 === false ? acc + 1 : acc),
              0,
            );
            setCorrectAnswer(correct);
            setWrongAnswer(wrong);
            setQuestions(questionsGame);
            if (indexNextQuestion < questions.length - 1) {
              setQuestion(questionsGame[indexNextQuestion]);
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
                startTimeRef.current = Date.now();
                setRunning(true)
              }, DELAY_START);
            });
          }
        });
      }
    };
    getGame();
  }, [navigate, uuidGame]);

  const shouldBlock = useCallback(() => !isEnd, [isEnd]);
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked" && !openConfirmModal) {
      setOpenConfirmModal(true);
      setBlockerState(blocker);
    }
  }, [blocker, openConfirmModal]);

  const handleConfirm = () => {
    setOpenConfirmModal(false);
    end();
  };

  const handleCancel = () => {
    setOpenConfirmModal(false);
    blockerState?.reset?.();
  };

  const safeGetStorage = (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
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
          <HeaderChallengeGame
            goodAnswer={correctAnswer}
            badAnswer={wrongAnswer}
            profile={profile}
            startTimeRef={startTimeRef}
            running={running}
          />
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
