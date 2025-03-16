import { Box, Container, Grid, Typography } from "@mui/material";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { px, viewHeight } from "csx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { supabase } from "src/api/supabase";
import { CircularLoading } from "src/component/Loading";
import { RoundTimer, VerticalTimer } from "src/component/time/Timer";
import { AvatarAccount } from "src/component/avatar/AvatarAccount";
import { WaitPlayerDuelGameBlock } from "src/component/play/WaitPlayerDuelGameBlock";
import { QuestionResponseBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { useUser } from "src/context/UserProvider";
import { DuelGame, DuelGameChange, ExtraDuelGame } from "src/models/DuelGame";
import { QuestionDuel } from "src/models/Question";
import { ResponseDuel } from "src/models/Response";
import { StatusGameDuel } from "src/models/enum/StatusGame";
import { Colors } from "src/style/Colors";
import { PreloadImages } from "src/utils/preload";

export default function DuelPage() {
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
  const [images, setImages] = useState<Array<string>>([]);

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

  const isPlayer1 = useMemo(() => {
    return uuid === game?.player1.id;
  }, [game, uuid]);

  const idPlayer1 = useMemo(
    () => (game?.player1 ? game.player1.id : null),
    [game]
  );
  const idPlayer2 = useMemo(
    () => (game?.player2 ? game.player2.id : null),
    [game]
  );

  const getBroadcastValidate = useCallback(
    (res: ResponseDuel) => {
      if (res.uuid === idPlayer1) {
        setResponsePlayer1(res);
        if (isPlayer1) {
          setResponse({
            responseplayer1: res.answer,
            response: res.correctanswer,
            result: res.result,
          });
        }
      } else if (res.uuid === idPlayer2) {
        setResponsePlayer2(res);
        if (!isPlayer1) {
          setResponse({
            responseplayer2: res.answer,
            response: res.correctanswer,
            result: res.result,
          });
        }
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
    },
    [idPlayer1, idPlayer2, isPlayer1]
  );

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
        .on("broadcast", { event: "question" }, (value) => {
          const questionduel = value.payload as QuestionDuel;
          let urls: Array<string> = [];
          let audio: HTMLAudioElement | undefined = undefined;
          if (questionduel.audio) {
            audio = new Audio(questionduel.audio);
            audio.load();
          }

          if (questionduel.image) {
            urls = [...urls, questionduel.image];
          }
          if (questionduel.typequestion === "IMAGE") {
            const images = questionduel.responses.reduce(
              (acc, v) => (v.image ? [...acc, v.image] : acc),
              [] as Array<string>
            );
            urls = [...urls, ...images];
          }
          setImages(urls);
          setTimeout(async () => {
            if (audio) {
              audio.volume = sound / 100;
              audio.play();
              setAudio(audio);
            }
            setTimer(questionduel.time);
            setQuestion(questionduel);
            setResponse(undefined);
            setResponsePlayer1(undefined);
            setResponsePlayer2(undefined);
          }, 2000);
        })
        .on("broadcast", { event: "endquestion" }, (value) => {
          const res = value.payload as Response;
          setTimer(undefined);
          setResponse((prev) => ({ ...res, ...prev }));
        })
        .on("broadcast", { event: "validate" }, (value) => {
          const res = value.payload as ResponseDuel;
          getBroadcastValidate(res);
        })
        .on("broadcast", { event: "end" }, (value) => {
          const res = value.payload as {
            extra: ExtraDuelGame;
          };
          channel.unsubscribe();
          setTimeout(() => {
            navigate(`/recapduel/${uuidGame}`, {
              state: {
                extra: res.extra,
              },
            });
          }, 2000);
        })
        .on("broadcast", { event: "cancel" }, () => {
          navigate(`/recapduel/${uuidGame}`);
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
  }, [uuidGame, navigate, uuid, audio, sound, getBroadcastValidate]);

  const validateResponse = async (value: Answer) => {
    if (channel && game && language && uuid) {
      channel.send({
        type: "broadcast",
        event: "response",
        payload: {
          response: value.value,
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

  const responseP1 = useMemo(
    () =>
      isPlayer1
        ? responsePlayer1
          ? responsePlayer1.answer
          : undefined
        : response
        ? responsePlayer1
          ? responsePlayer1.answer
          : undefined
        : undefined,
    [isPlayer1, responsePlayer1, response]
  );

  const responseP2 = useMemo(
    () =>
      !isPlayer1
        ? responsePlayer2
          ? responsePlayer2.answer
          : undefined
        : response
        ? responsePlayer2
          ? responsePlayer2.answer
          : undefined
        : undefined,
    [isPlayer1, responsePlayer2, response]
  );

  return (
    <Box>
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
                            {game.ptsplayer2}
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
                      answer={
                        responsePlayer1 ? responsePlayer1.time : undefined
                      }
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
                          responseplayer1={responseP1}
                          responseplayer2={responseP2}
                          response={response}
                          question={question}
                          onSubmit={validateResponse}
                        />
                      </Box>
                    </Box>
                    <VerticalTimer
                      time={timer}
                      color={Colors.colorDuel2}
                      answer={
                        responsePlayer2 ? responsePlayer2.time : undefined
                      }
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
    </Box>
  );
}
