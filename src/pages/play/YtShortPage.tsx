import { Box, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectSoloGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { QuestionSoloBlock } from "src/component/QuestionBlock";
import { ResponseSoloBlock } from "src/component/ResponseBlock";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";
import { MyResponse, ResponseSolo } from "src/models/Response";

import { percent, viewHeight } from "csx";
import { LoadingDot } from "src/component/Loading";
import { QcmResponseBlock } from "src/component/QcmBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { PreloadImages } from "src/utils/preload";
import { StatusGameSolo } from "src/models/enum/StatusGame";

export default function YtShortPage() {
  const { t } = useTranslation();
  const { language, sound } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<undefined | SoloGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | ResponseSolo>(undefined);
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

            setTimeout(async () => {
              if (questionSolo.allresponse === true) {
                navigate(`/recapsolo/${game.uuid}`, {
                  state: {
                    allquestion: true,
                    extra: questionSolo.extra,
                  },
                });
              } else {
                if (questionSolo.audio) {
                  const audio = new Audio(questionSolo.audio);
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
              }
            }, delay);
          });
      }
    },
    [navigate]
  );

  const validateResponse = useCallback(
    async (value: MyResponse | undefined) => {
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
        setResponse(res);
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
  }, [audio, sound]);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Box
      sx={{
        backgroundColor: Colors.black,
        height: viewHeight(100),
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: viewHeight(85),
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
              <>
                <QuestionSoloBlock question={question} timer={timer} />
                {question && question.isqcm ? (
                  <QcmResponseBlock
                    myresponse={myresponse}
                    response={response}
                    question={question}
                    onSubmit={validateResponse}
                  />
                ) : (
                  <>
                    {response ? (
                      <ResponseSoloBlock response={response} />
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
