import { Box, Grid } from "@mui/material";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { launchGameByGameId, selectGameByChannel } from "src/api/game";
import { selectPlayersByGame } from "src/api/player";
import { supabase } from "src/api/supabase";
import { AnswersBlock } from "src/component/AnswersBlock";
import { EndGameBlock } from "src/component/EndGameBlock";
import { GameBlock } from "src/component/GameBlock";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { MyRankBlock } from "src/component/MyRankBlock";
import { NewGameBlock } from "src/component/NewGameBlock";
import { QuestionBlock } from "src/component/QuestionBlock";
import { RankingGameBlock } from "src/component/RankingGameBlock";
import { ResponsePlayerBlock } from "src/component/ResponseBlock";
import { ResultQuestionBlock } from "src/component/ResultQuestionBlock";
import { Timer } from "src/component/Timer";
import { useUser } from "src/context/UserProvider";
import { Answer } from "src/models/Answer";
import { EndGame } from "src/models/EndGame";
import { Game } from "src/models/Game";
import { Player, PlayerScore } from "src/models/Player";
import { Question, QuestionPosition } from "src/models/Question";
import { Response } from "src/models/Response";

export const NUMBERQUESTION = 10;

export const PlayPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { uuid, username, language } = useUser();
  const { channelid } = useParams();

  const [game, setGame] = useState<Game | undefined>(undefined);
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
  const [playersResponse, setPlayersResponse] = useState<
    Array<{ uuid: string; position?: number }>
  >([]);
  const [health, setHealth] = useState(3);

  useEffect(() => {
    const getGame = () => {
      if (channelid) {
        selectGameByChannel(channelid).then(async ({ data }) => {
          if (data) {
            const game = data as Game;
            setGame(game);
            if (!game.in_progress) {
              await launchGameByGameId(game.id);
            }
          }
        });
      }
    };
    getGame();
  }, [channelid]);

  useEffect(() => {
    const getPlayers = () => {
      if (game) {
        selectPlayersByGame(game.id).then((res) => {
          setScores(res.data as Array<PlayerScore>);
        });
      }
    };
    getPlayers();
  }, [game]);

  useEffect(() => {
    if (state.username && uuid && channelid) {
      const channel = supabase.channel(channelid, {
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
          setPlayersResponse((prev) => [
            ...prev,
            { uuid: score.uuid, position: score.position },
          ]);
          setScores((prev) => [
            ...prev.filter((el) => el.id !== score.id),
            score,
          ]);
        })
        .on("broadcast", { event: "question" }, (value) => {
          const newQuestion = value.payload as Question;
          setHealth(3);
          setPlayersResponse([]);
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
          const newAnswer = value.payload as Response;
          const hasAnswer = answers.reduce(
            (acc, v) => acc || v.response,
            false
          );
          if (question && !hasAnswer) {
            setQuestionsPosition((prev) => [
              ...prev,
              {
                question: question.order,
                isRight: hasAnswer,
              },
            ]);
          }
          setTimer(undefined);
          setTimerNextGame(30);
          setAnswers([]);
          setResponse(newAnswer);
        })
        .on("broadcast", { event: uuid }, (value) => {
          const newAnswer = value.payload as Answer;
          setHealth(newAnswer.health);
          if (question && newAnswer.response) {
            setQuestionsPosition((prev) => [
              ...prev,
              {
                question: question.order,
                isRight: newAnswer.response,
                position: newAnswer.position,
              },
            ]);
          }
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
  }, [state, uuid, channelid, question, answers]);

  useEffect(() => {
    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [channel]);

  const validateResponse = (value: string) => {
    const hasAnswer = answers.reduce((acc, v) => acc || v.response, false);
    if (
      channel &&
      uuid &&
      language &&
      response === undefined &&
      !hasAnswer &&
      health > 0
    ) {
      channel.send({
        type: "broadcast",
        event: "responseuser",
        payload: {
          uuid: uuid,
          username: username,
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
          {game && <GameBlock game={game} />}
          <RankingGameBlock
            players={playersWithScore}
            responses={playersResponse}
          />
          <MyRankBlock players={playersWithScore} responses={playersResponse} />
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
                    <ResponsePlayerBlock response={response} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnswersBlock answers={answers} />
                </Grid>
              </Grid>
            </Box>
            <ResultQuestionBlock questions={questionsPosition} />
            <InputResponseBlock onSubmit={validateResponse} health={health} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
