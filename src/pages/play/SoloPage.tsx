import { Box, Container, Typography } from "@mui/material";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectSoloGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { QuestionSoloBlock } from "src/component/QuestionBlock";
import { ResponseSoloBlock } from "src/component/ResponseBlock";
import { useUser } from "src/context/UserProvider";
import { Question, QuestionSolo } from "src/models/Question";
import { ResponseSolo } from "src/models/Response";

import { percent, viewHeight } from "csx";
import { QcmBlock, QcmResponseBlock } from "src/component/QcmBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { LoadingDot } from "src/component/Loading";

export const SoloPage = () => {
  const { t } = useTranslation();
  const { uuid, language } = useUser();
  const { uuidGame } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );
  const [game, setGame] = useState<undefined | SoloGame>(undefined);

  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [response, setResponse] = useState<undefined | ResponseSolo>(undefined);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<undefined | number>(undefined);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectSoloGameById(uuidGame).then(({ data }) => {
          if (data !== null) {
            setGame(data as SoloGame);
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
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "sologame",
            filter: `uuid=eq.${game.uuid}`,
          },
          (payload) => {
            setQuestions(payload.new.questions as Array<Question>);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "sologame",
            filter: `uuid=eq.${game.uuid}`,
          },
          (payload) => {
            channel.unsubscribe();
            navigate(`/recapsolo`, {
              state: {
                questions: questions,
                theme: game.theme,
                score: score,
                allquestion: false,
              },
            });
          }
        )
        .on("broadcast", { event: "question" }, (value) => {
          setQuestion(value.payload as QuestionSolo);
          setTimer(14);
          setResponse(undefined);
          scrollTop();
        })
        .on("broadcast", { event: "validate" }, (value) => {
          const res = value.payload as ResponseSolo;
          setTimer(undefined);
          setResponse(res);
          setScore(res.points);
          scrollTop();
        })
        .on("broadcast", { event: "allquestion" }, () => {
          channel.unsubscribe();
          navigate(`/recapsolo`, {
            state: {
              questions: questions,
              theme: game.theme,
              score: score,
              allquestion: true,
            },
          });
        })
        .subscribe();
      setChannel(channel);
    }
  }, [uuid, game, questions, score, navigate]);

  const validateResponse = async (value: string) => {
    if (channel && game && language) {
      channel.send({
        type: "broadcast",
        event: "response",
        payload: {
          response: value,
          language: language.iso,
        },
      });
    }
  };

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
              {response && (
                <>
                  {question && question.isqcm ? (
                    <QcmResponseBlock response={response} question={question} />
                  ) : (
                    <ResponseSoloBlock response={response} />
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
              <Typography variant="h6" color="text.secondary">
                {t("commun.launchpartie")}
              </Typography>
              <LoadingDot />
            </Box>
          )}
        </Box>
        {!response && (
          <Box>
            {question && question.isqcm ? (
              <QcmBlock question={question} onSubmit={validateResponse} />
            ) : (
              <InputResponseBlock onSubmit={validateResponse} />
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};
