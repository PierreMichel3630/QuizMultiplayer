import { Box, Grid } from "@mui/material";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { launchGameByTheme, selectGameByTheme } from "src/api/game";
import { selectPlayersByTheme } from "src/api/player";
import { supabase } from "src/api/supabase";
import { selectThemeById } from "src/api/theme";
import { AnswersBlock } from "src/component/AnswersBlock";
import { EndGameBlock } from "src/component/EndGameBlock";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { MyRankBlock } from "src/component/MyRankBlock";
import { NewGameBlock } from "src/component/NewGameBlock";
import { QuestionBlock } from "src/component/QuestionBlock";
import { RankingGameBlock } from "src/component/RankingGameBlock";
import { ResponseBlock } from "src/component/ResponseBlock";
import { ResultQuestionBlock } from "src/component/ResultQuestionBlock";
import { ThemeBlock } from "src/component/ThemeBlock";
import { Timer } from "src/component/Timer";
import { useUser } from "src/context/UserProvider";
import { Answer } from "src/models/Answer";
import { EndGame } from "src/models/EndGame";
import { Game } from "src/models/Game";
import { Player, PlayerScore } from "src/models/Player";
import { Question, QuestionPosition } from "src/models/Question";
import { Response } from "src/models/Response";
import { Theme } from "src/models/Theme";

export const NUMBERQUESTION = 10;

export const PlayPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { uuid, language } = useUser();
  const { id } = useParams();

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );

  const [question, setQuestion] = useState<undefined | Question>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const [questionsPosition, setQuestionsPosition] = useState<
    Array<QuestionPosition>
  >([]);
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [scores, setScores] = useState<Array<PlayerScore>>([]);
  const [endGame, setEndGame] = useState<undefined | EndGame>(undefined);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [timerNewGame, setTimerNewGame] = useState<undefined | number>(10);
  const [timerNextGame, setTimerNextGame] = useState<undefined | number>(
    undefined
  );

  useEffect(() => {
    const getTheme = () => {
      if (id) {
        selectThemeById(Number(id)).then((res) => {
          if (res.data) setTheme(res.data as Theme);
        });
      }
    };
    getTheme();
  }, [id]);

  useEffect(() => {
    const getGame = () => {
      if (theme) {
        selectGameByTheme(theme.id).then(async ({ data }) => {
          if (data) {
            const game = data as Game;
            if (!game.in_progress) {
              await launchGameByTheme(theme.id);
            }
          }
        });
      }
    };
    getGame();
  }, [theme]);

  useEffect(() => {
    const getPlayers = () => {
      if (theme) {
        selectPlayersByTheme(theme.id).then((res) => {
          setScores(res.data as Array<PlayerScore>);
        });
      }
    };
    getPlayers();
  }, [theme]);

  useEffect(() => {
    if (state.username && uuid && theme) {
      const channel = supabase.channel(theme.name["en-US"], {
        config: {
          presence: { key: uuid },
        },
      });
      channel
        .on("presence", { event: "sync" }, async () => {
          const syncPlayer: Array<Player> = Object.values(
            channel.presenceState()
          ).map((el) => el[0] as Player);
          setPlayers(syncPlayer);
        })
        .on("broadcast", { event: "end" }, (value) => {
          setEndGame(value.payload as EndGame);
        })
        .on("broadcast", { event: "score" }, (value) => {
          const score: PlayerScore = value.payload;
          setScores((prev) => [
            ...prev.filter((el) => el.id !== score.id),
            score,
          ]);
        })
        .on("broadcast", { event: "question" }, (value) => {
          const newQuestion = value.payload as Question;
          setTimerNewGame(undefined);
          setResponse(undefined);
          setEndGame(undefined);
          setQuestion(newQuestion);
          setTimer(14);
          if (newQuestion.order === 1) {
            setQuestionsPosition([]);
            setScores([]);
          }
        })
        .on("broadcast", { event: "response" }, (value) => {
          if (question) {
            const hasAnswer = answers.reduce(
              (acc, v) => acc || v.response,
              false
            );
            setQuestionsPosition((prev) => [
              ...prev,
              {
                question: question.order,
                isRight: hasAnswer,
              },
            ]);
          }
          const newAnswer = value.payload as Response;
          setTimer(undefined);
          setTimerNextGame(30);
          setAnswers([]);
          setResponse(newAnswer);
        })
        .on("broadcast", { event: uuid }, (value) => {
          const newAnswer = value.payload as Answer;
          setAnswers((prev) => [...prev, newAnswer]);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              username: state.username,
              uuid: uuid,
              score: 0,
            });
          }
        });
      setChannel(channel);
    }
  }, [state, uuid, theme, question, answers]);

  useEffect(() => {
    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [channel]);

  const validateResponse = (value: string) => {
    const hasAnswer = answers.reduce((acc, v) => acc || v.response, false);
    if (channel && uuid && language && response === undefined && !hasAnswer) {
      channel.send({
        type: "broadcast",
        event: "responseuser",
        payload: {
          uuid: uuid,
          value: value,
          language: language.iso,
        },
      });
    }
  };

  const playersWithScore = players.map((player) => {
    const score = scores.find((score) => score.uuid === player.uuid);
    return { ...player, score: score ? score.score : 0 };
  });

  return (
    <Box sx={{ p: 1, display: "flex", flex: "1 1 0%" }}>
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid
          item
          xs={4}
          sx={{ display: "flex", gap: 1, flexDirection: "column" }}
        >
          {theme && <ThemeBlock theme={theme} />}
          <RankingGameBlock players={playersWithScore} />
          <MyRankBlock players={playersWithScore} />
        </Grid>
        {endGame ? (
          <Grid
            item
            xs={8}
            sx={{
              flexGrow: 1,
              display: "flex",
              minHeight: 0,
              flexDirection: "column",
              flex: "1 1 0",
              gap: 1,
            }}
          >
            <NewGameBlock timer={timerNextGame} />
            <EndGameBlock
              endGame={endGame}
              questionsPosition={questionsPosition}
            />
          </Grid>
        ) : timerNewGame ? (
          <Grid
            item
            xs={8}
            sx={{
              flexGrow: 1,
              display: "flex",
              minHeight: 0,
              flexDirection: "column",
              flex: "1 1 0",
            }}
          >
            <NewGameBlock timer={timerNewGame} />
          </Grid>
        ) : (
          <Grid
            item
            xs={8}
            sx={{ display: "flex", gap: 1, flexDirection: "column" }}
          >
            <QuestionBlock question={question} />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {timer && <Timer time={timer} size={200} thickness={3} />}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <Grid container spacing={1}>
                {response && (
                  <Grid item xs={12}>
                    <ResponseBlock response={response} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnswersBlock answers={answers} />
                </Grid>
              </Grid>
            </Box>
            <ResultQuestionBlock questions={questionsPosition} />
            <InputResponseBlock onSubmit={validateResponse} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
