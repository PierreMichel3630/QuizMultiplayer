import { Box, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { endSoloGame, selectSoloGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";

import { percent } from "csx";
import { LoadingDot } from "src/component/Loading";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { SoloGame } from "src/models/Game";
import { StatusGameSolo } from "src/models/enum/StatusGame";
import { decryptToNumber } from "src/utils/crypt";
import { PreloadImages } from "src/utils/preload";
import { getResponse, verifyResponseCrypt } from "src/utils/response";

export default function SoloPage() {
  const { t } = useTranslation();
  const { language, sound } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<undefined | SoloGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [images, setImages] = useState<Array<string>>([]);

  const timeoutQuestion = useRef<NodeJS.Timeout | null>(null);
  const localStorageId = useMemo(() => `game-solo-${uuidGame}`, [uuidGame]);

  const generateQuestion = useCallback(
    (game: undefined | SoloGame, delay: number) => {
      if (game) {
        const questionsgame: Array<unknown> = JSON.parse(
          localStorage.getItem(localStorageId) ?? "[]"
        );
        supabase.functions
          .invoke("question-solo-gameV4", {
            body: {
              game: game.uuid,
              questions: questionsgame,
            },
          })
          .then(({ data }) => {
            if (data.allresponse === true) {
              setTimeout(async () => {
                const questionsgame: Array<unknown> = JSON.parse(
                  localStorage.getItem(localStorageId) ?? "[]"
                );
                endSoloGame(questionsgame, game.uuid).then(() => {
                  navigate(`/recapsolo/${game.uuid}`, {
                    state: {
                      allquestion: true,
                    },
                  });
                });
                localStorage.removeItem(localStorageId);
              }, delay);
            } else {
              const questionSolo = data as QuestionSolo;
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
                timeoutQuestion.current = setTimeout(async () => {
                  const response = decryptToNumber(questionSolo.answer);
                  const questionsgame: Array<unknown> = JSON.parse(
                    localStorage.getItem(localStorageId) ?? "[]"
                  );
                  questionsgame.push({
                    ...questionSolo,
                    response: response,
                    resultPlayer1: false,
                    responsePlayer1: undefined,
                  });
                  localStorage.setItem(
                    localStorageId,
                    JSON.stringify(questionsgame)
                  );
                  setResponse({
                    answer: response,
                    result: false,
                    responsePlayer1: undefined,
                  });
                  setTimer(undefined);
                  scrollTop();
                }, questionSolo.time * 1000);
              }, delay);
            }
          });
      }
    },
    [localStorageId, navigate]
  );

  const validateResponse = useCallback(
    async (value: Answer) => {
      clearInterval(timeoutQuestion.current!);
      setTimer(undefined);
      const myResponseValue = value?.value ?? undefined;
      if (question && game && language) {
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
        setResponse({
          answer: response,
          result: result,
          responsePlayer1: myResponseValue,
          resultPlayer1: result,
        });
        if (result) {
          setScore((prev) => prev + 1);
          generateQuestion(game, 1500);
        } else {
          setTimeout(async () => {
            endSoloGame(questionsgame, game.uuid).then(() => {
              navigate(`/recapsolo/${game.uuid}`, {
                state: {
                  allquestion: false,
                },
              });
            });
            localStorage.removeItem(localStorageId);
          }, 1500);
        }
      }
      if (audio) {
        audio.pause();
      }
    },
    [
      audio,
      game,
      generateQuestion,
      language,
      localStorageId,
      navigate,
      question,
    ]
  );

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectSoloGameById(uuidGame).then(({ data }) => {
          if (data !== null) {
            const res = data as SoloGame;
            if (res.status === StatusGameSolo.END) {
              navigate(`/recapsolo/${res.uuid}`);
            } else {
              setGame(res);
              generateQuestion(res, 1000);
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

  const scrollTop = () => {
    window.scrollTo(0, 0);
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
        {game && (
          <Box>
            <ScoreThemeBlock theme={game.theme} score={score} />
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
              <LoadingDot />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
