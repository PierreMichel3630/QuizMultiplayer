import { Box, Container, Grid, Typography } from "@mui/material";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { px } from "csx";
import moment, { Moment } from "moment";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { CircularLoading } from "src/component/Loading";
import { AvatarAccount } from "src/component/avatar/AvatarAccount";
import { WaitPlayerDuelGameBlock } from "src/component/play/WaitPlayerDuelGameBlock";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { RoundTimer, VerticalTimer } from "src/component/time/Timer";
import { useUser } from "src/context/UserProvider";
import { DuelGame, DuelGameChange } from "src/models/DuelGame";
import { QuestionDuel } from "src/models/Question";
import { ResponseDuel } from "src/models/Response";
import { StatusGameDuel } from "src/models/enum/StatusGame";
import { Colors } from "src/style/Colors";
import { Bot, getBotByUuid, getResponseBot } from "src/utils/bot";
import { decrypt } from "src/utils/crypt";
import { PreloadImages } from "src/utils/preload";
import { verifyResponseCrypt } from "src/utils/response";

export default function DuelPage() {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { uuid, sound, language } = useUser();
  const navigate = useNavigate();

  const POINTSCORRECTANSWER = 25;

  const [bot, setBot] = useState<Bot | undefined>(undefined);
  const [time, setTime] = useState<Moment>(moment());
  const [players, setPlayers] = useState<Array<string>>([]);
  const [game, setGame] = useState<undefined | DuelGame>(undefined);
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [questions, setQuestions] = useState<Array<QuestionDuel>>([]);
  const [question, setQuestion] = useState<undefined | QuestionDuel>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [images, setImages] = useState<Array<string>>([]);
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectDuelGameById(uuidGame).then(({ data }) => {
          if (data !== null) {
            setGame(data as DuelGame);
          } else {
            navigate("/");
          }
        });
      }
    };
    getGame();
  }, [navigate, uuidGame]);

  useEffect(() => {
    if (game && game.player2) {
      const bot = getBotByUuid(game?.player2.id);
      setBot(bot);
    }
  }, [game]);

  useEffect(() => {
    if (uuidGame) {
      const channel = supabase
        .channel(uuidGame, {
          config: {
            presence: {
              key: "uuid",
            },
          },
        })
        .on("presence", { event: "sync" }, async () => {
          const newState = channel.presenceState() as RealtimePresenceState<{
            uuid: string;
          }>;
          const uuids = newState.uuid ? newState.uuid.map((el) => el.uuid) : [];
          setPlayers(uuids);
        })
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "duelgame",
            filter: `player1=eq.${uuid}`,
          },
          (payload) => {
            const res = payload.new as DuelGameChange;
            if (res.status === StatusGameDuel.CANCEL) {
              navigate(`/recapduel/${res.uuid}`);
            }
          }
        )
        .on("broadcast", { event: "updategame" }, (value) => {
          const res = value.payload as DuelGame;
          setGame(res);
        })
        .on("broadcast", { event: "questions" }, (value) => {
          const questions = value.payload as Array<QuestionDuel>;
          setQuestions(questions);
          const urls: Array<string> = [...questions]
            .filter((el) => el.image !== undefined)
            .map((el) => el.image as string);
          setImages(urls);
          const questionduel = questions[0];
          let audio: HTMLAudioElement | undefined = undefined;
          if (questionduel.audio) {
            audio = new Audio(questionduel.audio);
            audio.load();
          }
          setTimeout(async () => {
            if (audio) {
              audio.volume = sound / 100;
              audio.play();
              setAudio(audio);
            }
            setTimer(questionduel.time);
            setTime(moment());
            setQuestion(questionduel);
            setResponse(undefined);
          }, 2000);
        })
        .on("broadcast", { event: "cancel" }, () => {
          navigate(`/recapduel/${uuidGame}`);
        })
        .on("broadcast", { event: "response" }, (value) => {
          const res = value.payload as ResponseDuel;
          console.log(res);
        })
        .subscribe(async (status) => {
          if (status !== "SUBSCRIBED") {
            return;
          }
          await channel.track({ uuid });
        });
      setChannel(channel);
      return () => {
        channel.unsubscribe();
        if (audio) {
          audio.pause();
        }
      };
    }
  }, [uuidGame, navigate, uuid, audio, sound]);

  const validateResponse = useCallback(
    async (value: Answer) => {
      const timeDiff = moment().diff(time);
      if (channel && question && language) {
        const result = value
          ? verifyResponseCrypt(question, language, value)
          : false;
        const answer = decrypt(question.answer) as string;
        if (game?.player1.id === value.uuid) {
          setResponse((prev) => ({
            ...prev,
            result: result,
            responsePlayer1: value.value,
            resultPlayer1: result,
            timePlayer1: timeDiff,
            answer: answer,
          }));
          updateScore(setScoreP1, result, timeDiff);
        } else if (game?.player2.id === value.uuid) {
          setResponse((prev) => ({
            ...prev,
            result: result,
            responsePlayer2: value.value,
            resultPlayer2: result,
            timePlayer2: timeDiff,
            answer: answer,
          }));
          updateScore(setScoreP2, result, timeDiff);
        }
        channel.send({
          type: "broadcast",
          event: "response",
          payload: {
            uuid: uuid,
            answerPlayer: value.value,
            result: result,
            answer: answer,
          },
        });
        if (audio) {
          audio.pause();
        }
      }
    },
    [audio, channel, game, question, time, uuid, language]
  );

  const goNextQuestion = useCallback(() => {
    const index = question
      ? questions.findIndex((el) => el.id === question.id)
      : undefined;
    if (index === undefined || index < questions.length - 1) {
      const idNextQuestion = index !== undefined ? index + 1 : 0;
      const question = questions[idNextQuestion];
      setResponse(undefined);
      setQuestion(question);
      setTimer(question.time);
      setTime(moment());
    } else {
      console.log("end");
      console.log(questions);
    }
  }, [question, questions]);

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
  }, [audio, sound]);

  const handleEnd = useCallback(() => {
    if (question) {
      const answer = decrypt(question.answer) as string;

      setResponse((prev) =>
        prev
          ? {
              ...prev,
              answer: answer,
            }
          : prev
      );
    }
    setTimer(undefined);
    setTimeout(() => {
      goNextQuestion();
    }, 2000);
  }, [goNextQuestion, question]);

  const updateScore = (
    set: Dispatch<SetStateAction<number>>,
    result: boolean,
    time: number
  ) => {
    if (result) {
      const score = POINTSCORRECTANSWER - Math.round(time / 1000);
      set((prev) => prev + score);
    }
  };

  useEffect(() => {
    if (bot && question) {
      const response = getResponseBot(bot, question);
      setTimeout(() => {
        setResponse((prev) => ({
          ...prev,
          responsePlayer2: response.response,
          resultPlayer2: response.result,
          timePlayer2: response.time,
        }));
        updateScore(setScoreP2, response.result, response.time);
      }, response.time);
    }
  }, [bot, question, validateResponse]);

  console.log(response);

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
          flexDirection: "column",
          gap: 1,
        }}
      >
        {game ? (
          <>
            {game.status === "START" && question ? (
              <Box
                sx={{
                  display: "flex",
                  flex: "1 1 0",
                  flexGrow: 1,
                  flexDirection: "column",
                  gap: 1,
                  p: 1,
                }}
              >
                <Box>
                  <Grid container spacing={1} alignItems="center">
                    <Grid
                      item
                      xs={5}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 1,
                      }}
                    >
                      <AvatarAccount
                        avatar={game.player1.avatar.icon}
                        size={50}
                        color={Colors.colorDuel1}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: Colors.colorDuel1,
                            wordBreak: "break-all",
                            fontSize: 9,
                          }}
                        >
                          {game.player1.username}
                        </Typography>
                        <Typography
                          variant="h2"
                          sx={{ color: Colors.colorDuel1 }}
                        >
                          {scoreP1}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      {timer && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <RoundTimer
                            time={timer}
                            size={45}
                            thickness={6}
                            fontSize={15}
                            end={handleEnd}
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: Colors.colorDuel2,
                            textAlign: "right",
                            fontSize: 9,
                          }}
                        >
                          {game.player2.username}
                        </Typography>
                        <Typography
                          variant="h2"
                          sx={{
                            color: Colors.colorDuel2,
                            textAlign: "right",
                          }}
                        >
                          {scoreP2}
                        </Typography>
                      </Box>
                      <AvatarAccount
                        avatar={game.player2.avatar.icon}
                        size={50}
                        color={Colors.colorDuel2}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    flex: "1 1 0",
                    display: "flex",
                    flexDirection: "row",
                    gap: px(5),
                  }}
                >
                  <VerticalTimer
                    time={timer}
                    color={Colors.colorDuel1}
                    answer={response?.timePlayer1}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      flex: "1 1 0",
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        flex: "1 1 0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      <QuestionResponseBlock
                        response={response}
                        question={question}
                        onSubmit={validateResponse}
                      />
                    </Box>
                  </Box>
                  <VerticalTimer
                    time={timer}
                    color={Colors.colorDuel2}
                    answer={response?.timePlayer2}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <WaitPlayerDuelGameBlock game={game} players={players} />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <CircularLoading />
          </Box>
        )}
      </Box>
    </Container>
  );
}
