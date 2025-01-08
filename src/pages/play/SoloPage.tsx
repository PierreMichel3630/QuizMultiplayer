import { Box, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectSoloGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";
import { ResponseSolo } from "src/models/Response";

import { percent, viewHeight } from "csx";
import { LoadingDot } from "src/component/Loading";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { SoloGame } from "src/models/Game";
import { StatusGameSolo } from "src/models/enum/StatusGame";
import { Colors } from "src/style/Colors";
import { PreloadImages } from "src/utils/preload";

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
  const [timeoutQuestion, setTimeoutQuestion] = useState<
    string | number | NodeJS.Timeout | undefined
  >(undefined);
  const [images, setImages] = useState<Array<string>>([]);
  const [myresponse, setMyresponse] = useState<string | number | undefined>(
    undefined
  );
  const [timeoutsId, setTimeoutsId] = useState<Array<NodeJS.Timeout>>([]);

  useEffect(() => {
    return () => {
      timeoutsId.forEach((el) => {
        clearTimeout(el);
      });
    };
  }, [timeoutsId]);

  const generateQuestion = useCallback(
    (game: undefined | SoloGame, delay: number) => {
      if (game) {
        supabase.functions
          .invoke("question-solo-gameV2", {
            body: {
              game: game.uuid,
            },
          })
          .then(({ data }) => {
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

            const idTimeout = setTimeout(async () => {
              if (questionSolo.allresponse === true) {
                navigate(`/recapsolo/${game.uuid}`, {
                  state: {
                    allquestion: true,
                    extra: questionSolo.extra,
                  },
                });
              } else {
                if (audio) {
                  setAudio(audio);
                }
                setQuestion(questionSolo);
                setTimer(questionSolo.time - 1);
                setResponse(undefined);
                scrollTop();
                const newtimeoutQuestion = setTimeout(async () => {
                  const response = await supabase.functions.invoke(
                    "response-solo-game",
                    {
                      body: {
                        game: game.uuid,
                        response: undefined,
                      },
                    }
                  );
                  const res = response.data as ResponseSolo;
                  setTimer(undefined);
                  setResponse(res);
                  setScore(res.points);
                  scrollTop();
                  setTimeout(async () => {
                    navigate(`/recapsolo/${game.uuid}`, {
                      state: {
                        allquestion: false,
                        extra: res.extra,
                      },
                    });
                  }, 1500);
                }, questionSolo.time * 1000);
                setTimeoutQuestion(newtimeoutQuestion);
                setTimeoutsId((prev) => [...prev, newtimeoutQuestion]);
              }
            }, delay);
            setTimeoutsId((prev) => [...prev, idTimeout]);
          });
      }
    },
    [navigate]
  );

  const validateResponse = useCallback(
    async (value: Answer) => {
      const myResponseValue = value ? value.value : undefined;
      setMyresponse(myResponseValue);
      setTimer(undefined);
      clearTimeout(timeoutQuestion);
      if (game && language) {
        const { data } = await supabase.functions.invoke("response-solo-game", {
          body: {
            game: game.uuid,
            response: myResponseValue,
            language: language.iso,
            exact: value ? value.exact : undefined,
          },
        });
        const res = data as ResponseSolo;
        setMyresponse(undefined);
        setTimer(undefined);
        setResponse({
          response: res.response,
          result: res.result,
          responseplayer1: res.answer,
        });
        setScore(res.points);
        scrollTop();
        if (res.result) {
          generateQuestion(game, 1500);
        } else {
          setTimeout(async () => {
            navigate(`/recapsolo/${game.uuid}`, {
              state: {
                allquestion: false,
                extra: res.extra,
              },
            });
          }, 1500);
        }
        if (audio) {
          audio.pause();
        }
      }
    },
    [audio, game, generateQuestion, language, navigate, timeoutQuestion]
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

  const responseP1 = useMemo(
    () =>
      myresponse ? myresponse : response ? response.responseplayer1 : undefined,
    [myresponse, response]
  );

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
                <Typography variant="h4" color="text.secondary">
                  {t("commun.launchpartie")}
                </Typography>
                <LoadingDot />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
