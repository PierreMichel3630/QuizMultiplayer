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
import { ResponseSolo } from "src/models/Response";

import { percent, viewHeight } from "csx";
import { LoadingDot } from "src/component/Loading";
import { QcmResponseBlock } from "src/component/QcmBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame } from "src/models/Game";
import { StatusGameSolo } from "src/models/enum";
import { Colors } from "src/style/Colors";

export const SoloPage = () => {
  const { t } = useTranslation();
  const { uuid, language, sound } = useUser();
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

  const validateResponse = useCallback(
    async (value: string | number | undefined) => {
      if (game && language) {
        const { data } = await supabase.functions.invoke("response-solo-game", {
          body: { game: game.uuid, response: value, language: language.iso },
        });
        clearTimeout(timeoutQuestion);
        const res = data as ResponseSolo;
        setTimer(undefined);
        setResponse(res);
        setScore(res.points);
        scrollTop();
        setTimeout(async () => {
          if (res.result) {
            await supabase.functions.invoke("question-solo-game", {
              body: {
                game: game.uuid,
              },
            });
          } else {
            navigate(`/recapsolo/${game.uuid}`, {
              state: {
                allquestion: false,
              },
            });
          }
        }, 2000);
        if (audio) {
          audio.pause();
        }
      }
    },
    [audio, game, language, navigate, timeoutQuestion]
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
            }
          } else {
            navigate("/");
          }
        });
      }
    };
    getGame();
  }, [navigate, uuidGame]);

  useEffect(() => {
    if (game) {
      const channel = supabase
        .channel(game.uuid)
        .on("broadcast", { event: "question" }, (value) => {
          const questionSolo = value.payload as QuestionSolo;
          if (questionSolo.audio) {
            const audio = new Audio(questionSolo.audio);
            audio.volume = sound / 100;
            audio.play();
            setAudio(audio);
          }
          setQuestion(questionSolo);
          setTimer(questionSolo.time);
          setResponse(undefined);
          scrollTop();
          const newtimeoutQuestion = setTimeout(async () => {
            validateResponse(undefined);
          }, questionSolo.time * 1000);
          setTimeoutQuestion(newtimeoutQuestion);
        })
        .on("broadcast", { event: "allquestion" }, (value) => {
          const res = value.payload as SoloGame;
          channel.unsubscribe();
          supabase.removeChannel(channel);
          navigate(`/recapsolo/${res.uuid}`, {
            state: {
              allquestion: true,
            },
          });
        })
        .subscribe();
      return () => {
        channel.unsubscribe();
        supabase.removeChannel(channel);
        if (audio) {
          audio.pause();
        }
      };
    }
  }, [uuid, game, navigate, audio, sound, validateResponse]);

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
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
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
                  response={response}
                  question={question}
                  onSubmit={validateResponse}
                />
              ) : (
                <>
                  {response ? (
                    <ResponseSoloBlock response={response} />
                  ) : (
                    <InputResponseBlock onSubmit={validateResponse} />
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
  );
};
