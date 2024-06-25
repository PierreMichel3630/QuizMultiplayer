import { Box, Container, Grid, Typography } from "@mui/material";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { px, viewHeight } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { CircularLoading } from "src/component/Loading";
import { QcmBlockDuelBlock } from "src/component/QcmBlock";
import { QuestionDuelBlock } from "src/component/QuestionBlock";
import { ResponseDuelBlock } from "src/component/ResponseBlock";
import { RoundTimer, VerticalTimer } from "src/component/Timer";
import { AvatarAccount } from "src/component/avatar/AvatarAccount";
import { WaitPlayerDuelGameBlock } from "src/component/play/WaitPlayerDuelGameBlock";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { Elo } from "src/models/Elo";
import { QuestionDuel } from "src/models/Question";
import { Response, ResponseDuel } from "src/models/Response";
import { Colors } from "src/style/Colors";

export const COLORDUEL1 = Colors.pink;
export const COLORDUEL2 = Colors.blue;

export const DuelPage = () => {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { uuid, language, sound } = useUser();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Array<string>>([]);
  const [game, setGame] = useState<undefined | DuelGame>(undefined);
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [question, setQuestion] = useState<undefined | QuestionDuel>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [audio, setAudio] = useState<undefined | HTMLAudioElement>(undefined);
  const [responsePlayer1, setResponsePlayer1] = useState<
    undefined | ResponseDuel
  >(undefined);
  const [responsePlayer2, setResponsePlayer2] = useState<
    undefined | ResponseDuel
  >(undefined);

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
    if (game) {
      const channel = supabase
        .channel(game.uuid, {
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
        .on("broadcast", { event: "updategame" }, (value) => {
          const game = value.payload as DuelGame;
          setGame(game);
        })
        .on("broadcast", { event: "question" }, (value) => {
          const questionduel = value.payload as QuestionDuel;
          if (questionduel.audio) {
            const audio = new Audio(questionduel.audio);
            audio.volume = sound / 100;
            audio.play();
            setAudio(audio);
          }
          setTimer(questionduel.time);
          setQuestion(questionduel);
          setResponse(undefined);
          setResponsePlayer1(undefined);
          setResponsePlayer2(undefined);
        })
        .on("broadcast", { event: "endquestion" }, (value) => {
          setTimer(undefined);
          setResponse(value.payload as Response);
        })
        .on("broadcast", { event: "validate" }, (value) => {
          const res = value.payload as ResponseDuel;
          if (game) {
            if (res.uuid === game.player1.id) {
              setResponsePlayer1(res);
            } else if (res.uuid === game.player2.id) {
              setResponsePlayer2(res);
            }
            setGame((prev) =>
              prev
                ? {
                    ...prev,
                    ptsplayer1: res.ptsplayer1,
                    ptsplayer2: res.ptsplayer2,
                  }
                : undefined
            );
          }
        })
        .on("broadcast", { event: "end" }, (value) => {
          const res = value.payload as {
            game: DuelGame;
            elo: Elo;
          };
          channel.unsubscribe();
          navigate(`/recapduel`, {
            state: {
              game: res.game,
              elo: res.elo,
              questions: res.game.questions,
            },
          });
        })
        .on("broadcast", { event: "cancel" }, () => {
          navigate(`/recapduel`, {
            state: {
              game: game,
            },
          });
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
  }, [game, navigate, uuid, audio, sound]);

  const validateResponse = async (value: string | number) => {
    if (channel && game && language && uuid) {
      channel.send({
        type: "broadcast",
        event: "response",
        payload: {
          response: value,
          language: language.iso,
          uuid: uuid,
        },
      });
      if (audio) {
        audio.pause();
      }
    }
  };

  useEffect(() => {
    if (audio) {
      audio.volume = sound / 100;
      audio.play();
    }
  }, [audio, sound]);

  const isPlayer1 = useMemo(() => {
    return uuid === game?.player1.id;
  }, [game, uuid]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
        backgroundColor: Colors.black,
        p: 0,
      }}
    >
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
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
            {game.start && question ? (
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
                        color={COLORDUEL1}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: COLORDUEL1,
                            wordBreak: "break-all",
                            fontSize: 9,
                          }}
                        >
                          {game.player1.username}
                        </Typography>
                        <Typography variant="h2" sx={{ color: COLORDUEL1 }}>
                          {game.ptsplayer1}
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
                            color: COLORDUEL2,
                            textAlign: "right",
                            fontSize: 9,
                          }}
                        >
                          {game.player2.username}
                        </Typography>
                        <Typography
                          variant="h2"
                          sx={{ color: COLORDUEL2, textAlign: "right" }}
                        >
                          {game.ptsplayer2}
                        </Typography>
                      </Box>
                      <AvatarAccount
                        avatar={game.player2.avatar.icon}
                        size={50}
                        color={COLORDUEL2}
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
                    color={COLORDUEL1}
                    answer={responsePlayer1 ? responsePlayer1.time : undefined}
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
                      <QuestionDuelBlock question={question} />
                      {question && (
                        <>
                          {question.isqcm ? (
                            <QcmBlockDuelBlock
                              question={question}
                              response={response}
                              responseMe={
                                isPlayer1 ? responsePlayer1 : responsePlayer2
                              }
                              responseAdv={
                                isPlayer1 ? responsePlayer2 : responsePlayer1
                              }
                              isPlayer1={isPlayer1}
                              onSubmit={validateResponse}
                            />
                          ) : (
                            <ResponseDuelBlock
                              response={response}
                              responsePlayer1={responsePlayer1}
                              responsePlayer2={responsePlayer2}
                              onSubmit={validateResponse}
                            />
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                  <VerticalTimer
                    time={timer}
                    color={COLORDUEL2}
                    answer={responsePlayer2 ? responsePlayer2.time : undefined}
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
};
