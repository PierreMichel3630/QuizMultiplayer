import { Box, Container, Grid, Typography } from "@mui/material";
import { RealtimeChannel } from "@supabase/supabase-js";
import { viewHeight } from "csx";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { CircularLoading } from "src/component/Loading";
import { QcmBlockDuelBlock } from "src/component/QcmBlock";
import { QuestionDuelBlock } from "src/component/QuestionBlock";
import { ResponseDuelBlock } from "src/component/ResponseBlock";
import { RoundTimer, VerticalTimer } from "src/component/Timer";
import { AvatarAccount } from "src/component/avatar/AvatarAccount";
import { CancelDuelGameBlock } from "src/component/play/CancelDuelGameBlock";
import { EndDuelGameBlock } from "src/component/play/EndDuelGameBlock";
import { WaitPlayerDuelGameBlock } from "src/component/play/WaitPlayerDuelGameBlock";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { QuestionDuel } from "src/models/Question";
import { Response, ResponseDuel } from "src/models/Response";
import { Colors } from "src/style/Colors";

export const DuelPage = () => {
  const { t } = useTranslation();
  const { uuidGame } = useParams();
  const { uuid, language } = useUser();

  const [players, setPlayers] = useState<Array<string>>([]);
  const [game, setGame] = useState<undefined | DuelGame>(undefined);
  const [end, setEnd] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [question, setQuestion] = useState<undefined | QuestionDuel>(undefined);
  const [response, setResponse] = useState<undefined | Response>(undefined);
  const [responsePlayer1, setResponsePlayer1] = useState<
    undefined | ResponseDuel
  >(undefined);
  const [responsePlayer2, setResponsePlayer2] = useState<
    undefined | ResponseDuel
  >(undefined);

  const equality = game && game.ptsplayer1 === game.ptsplayer2;
  const color1 =
    !game || equality
      ? Colors.white
      : game.ptsplayer1 > game.ptsplayer2
      ? Colors.green
      : Colors.red;
  const color2 =
    !game || equality
      ? Colors.white
      : game.ptsplayer2 > game.ptsplayer1
      ? Colors.green
      : Colors.red;

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectDuelGameById(uuidGame).then((res) => {
          setGame(res.data as DuelGame);
        });
      }
    };
    getGame();
  }, [uuidGame]);

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
          const newState = channel.presenceState();
          const uuids = newState.uuid ? newState.uuid.map((el) => el.uuid) : [];
          setPlayers(uuids);
        })
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "duelgame",
            filter: `uuid=eq.${game.uuid}`,
          },
          (payload) => {
            const newGame = payload.new as DuelGame;
            setGame((prev) =>
              prev
                ? {
                    ...prev,
                    ptsplayer1: newGame.ptsplayer1,
                    ptsplayer2: newGame.ptsplayer2,
                    start: newGame.start,
                  }
                : newGame
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "duelgame",
            filter: `uuid=eq.${game.uuid}`,
          },
          (payload) => {
            setEnd(true);
            channel.unsubscribe();
          }
        )
        .on("broadcast", { event: "question" }, (value) => {
          setQuestion(value.payload as QuestionDuel);
          setResponse(undefined);
          setResponsePlayer1(undefined);
          setResponsePlayer2(undefined);
          setTimer(9);
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
          }
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
      };
    }
  }, [game]);

  const validateResponse = async (value: string) => {
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
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
      }}
    >
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 0%",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {game ? (
          <>
            {game.start && question ? (
              end ? (
                <EndDuelGameBlock game={game} />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flex: "1 1 0%",
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
                          avatar={game.player1.avatar}
                          size={50}
                          color={color1}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              color: color1,
                              wordBreak: "break-all",
                              fontSize: 9,
                            }}
                          >
                            {game.player1.username}
                          </Typography>
                          <Typography variant="h2" sx={{ color: color1 }}>
                            {game.ptsplayer1}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        {timer && (
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
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
                              color: color2,
                              textAlign: "right",
                              fontSize: 9,
                            }}
                          >
                            {game.player2.username}
                          </Typography>
                          <Typography
                            variant="h2"
                            sx={{ color: color2, textAlign: "right" }}
                          >
                            {game.ptsplayer2}
                          </Typography>
                        </Box>
                        <AvatarAccount
                          avatar={game.player2.avatar}
                          size={50}
                          color={color2}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                    }}
                  >
                    {timer && (
                      <VerticalTimer
                        time={timer}
                        color={color1}
                        answer={
                          responsePlayer1 ? responsePlayer1.time : undefined
                        }
                      />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexGrow: 1,
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
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
                                responses={question.responses}
                                response={response}
                                responsePlayer1={responsePlayer1}
                                responsePlayer2={responsePlayer2}
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
                    {timer && (
                      <VerticalTimer
                        time={timer}
                        color={color2}
                        answer={
                          responsePlayer2 ? responsePlayer2.time : undefined
                        }
                      />
                    )}
                  </Box>
                </Box>
              )
            ) : end ? (
              <CancelDuelGameBlock game={game} />
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
