import {
  Alert,
  Container,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Box, Grid } from "@mui/system";
import { important, percent, px } from "csx";
import { Fragment, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { TitleBlock } from "src/component/title/Title";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { saveGameModeScore } from "src/api/gamemode";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { ChangeNumberBlock } from "src/component/ChangeBlock";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { RankingGameMode } from "src/component/ranking/gamemode/RankingGameMode";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { ResultGameModeScore } from "src/models/GameMode";
import { CircularLoading } from "src/component/Loading";

enum StatusGame {
  NOTSTART = "NOTSTART",
  PLAY = "PLAY",
  WAIT = "WAIT",
  ERROR = "ERROR",
  FINISH = "FINISH",
}
export default function ReactionTimePage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const type = TypeGameMode.reactiontime;

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
  const [average, setAverage] = useState<null | number>(null);
  const [attempts, setAttempts] = useState<Array<number>>([]);
  const [finishReaction, setFinishReaction] = useState(false);
  const [reactionTime, setReactionTime] = useState<null | number>(null);
  const [dataResult, setDataResult] = useState<null | ResultGameModeScore>(
    null,
  );

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<undefined | number>(undefined);

  const reset = () => {
    setDataResult(null);
    setAttempts([]);
    launch();
  };

  const launch = () => {
    setFinishReaction(false);
    setStatusGame(StatusGame.PLAY);
    const delay = Math.floor(Math.random() * 2000) + 2000;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setFinishReaction(true);
    }, delay);
  };

  const handleAreaClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (finishReaction === false) {
      clearTimeout(timerRef.current);
      setAttempts([]);
      setStatusGame(StatusGame.ERROR);
    } else {
      const endTime = performance.now();
      const diff = endTime - startTimeRef.current;

      setReactionTime(diff);

      const newAttempts = [...attempts, diff];
      setAttempts(newAttempts);

      if (newAttempts.length === MAX_ATTEMPTS) {
        const result =
          newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
        setAverage(result);
        setStatusGame(StatusGame.FINISH);
        if (profile) {
          saveGameModeScore(result, type, Order.DESC).then(({ data }) => {
            setDataResult(data);
          });
        }
      } else {
        setStatusGame(StatusGame.WAIT);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.braintest.title")} - ${t("appname")}`}</title>
        </Helmet>

        <Grid size={12}>
          {statusGame === StatusGame.PLAY && (
            <Box
              onPointerDown={handleAreaClick}
              sx={{
                backgroundColor: finishReaction ? Colors.green : Colors.red,
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                touchAction: "none",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: important(px(50)),
                }}
              >
                {finishReaction
                  ? t("gamemode.reactiontime.clic")
                  : t("gamemode.reactiontime.wait")}
              </Typography>
            </Box>
          )}
          {statusGame === StatusGame.ERROR && (
            <Box
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                reset();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                width: percent(100),
                height: "100vh",
              }}
            >
              <Grid
                container
                spacing={1}
                sx={{ textAlign: "center", width: percent(100) }}
              >
                <Grid size={12}>
                  <AccessTimeIcon sx={{ fontSize: px(100) }} />
                </Grid>
                <Grid size={12}>
                  <Typography variant="h2">
                    {t("gamemode.reactiontime.clictoosoon")}
                  </Typography>
                </Grid>
                <Grid
                  size={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Alert severity="warning">
                    {t("gamemode.reactiontime.clictoosoontext")}
                  </Alert>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6">
                    {t("gamemode.reactiontime.tryagain")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          {statusGame === StatusGame.WAIT && (
            <Box
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                launch();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                width: percent(100),
                height: "100vh",
              }}
            >
              <Grid
                container
                spacing={1}
                sx={{ textAlign: "center", width: percent(100) }}
              >
                <Grid size={12}>
                  <Typography variant="h2">
                    {t("gamemode.reactiontime.attempt")} : {attempts.length} /{" "}
                    {MAX_ATTEMPTS}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <AccessTimeIcon sx={{ fontSize: px(100) }} />
                </Grid>
                <Grid size={12}>
                  <Typography variant="h2">{reactionTime} ms</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6">
                    {t("gamemode.reactiontime.continue")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          {statusGame === StatusGame.NOTSTART && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <TitleBlock title={t("gamemode.reactiontime.name")} />
                </Grid>
                <Grid size={12}>
                  <Typography fontSize={15}>
                    {t("gamemode.reactiontime.rules")}
                  </Typography>
                </Grid>
                {profile === null && (
                  <Grid
                    size={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <ConnectAlert />
                  </Grid>
                )}
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.colorApp}
                    label={t("commun.launchgame")}
                    variant="contained"
                    onClick={launch}
                  />
                </Grid>
                <Grid size={12}>
                  <RankingGameMode type={type} unit="ms" />
                </Grid>
              </Grid>
            </Box>
          )}

          {statusGame === StatusGame.FINISH && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <Typography variant="h2">{t("gamemode.results")}</Typography>
                </Grid>
                {profile ? (
                  <>
                    {dataResult ? (
                      <>
                        {dataResult.hasrecord ? (
                          <Grid
                            size={12}
                            sx={{
                              color: Colors.correctanswer,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="h2"
                              textAlign="center"
                              sx={{ fontSize: important(px(45)) }}
                            >
                              {t("commun.win")}
                            </Typography>
                            <Typography>{t("commun.newrecord")}</Typography>
                          </Grid>
                        ) : (
                          <Grid
                            size={12}
                            sx={{
                              color: Colors.wronganswer,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="h2"
                              textAlign="center"
                              sx={{ fontSize: important(px(45)) }}
                            >
                              {t("commun.loose")}
                            </Typography>
                            <Typography>
                              {t("commun.norecordbroken")}
                            </Typography>
                          </Grid>
                        )}
                        <Grid size={12}>
                          <MyExperienceSoloBlock
                            xp={{
                              match: 50,
                              record: dataResult.hasrecord ? 100 : undefined,
                            }}
                          />
                        </Grid>
                        {dataResult.hasrecord && (
                          <Grid
                            sx={{ display: "flex", justifyContent: "center" }}
                            size={12}
                          >
                            <AddMoneyBlock
                              money={100}
                              variant="h4"
                              width={25}
                            />
                          </Grid>
                        )}
                        <Grid
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="subtitle1">
                              {t("gamemode.record")} :
                            </Typography>
                            <Typography
                              variant="h3"
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            >
                              {dataResult.result.score} ms
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="subtitle1">
                              {t("gamemode.score")} :
                            </Typography>
                            <Typography
                              variant="h3"
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            >
                              {average?.toFixed(2)} ms
                            </Typography>
                            {dataResult?.previousScore && average && (
                              <ChangeNumberBlock
                                value={average}
                                previous={dataResult?.previousScore.score}
                                unit="ms"
                                variant="h6"
                                order={Order.DESC}
                              />
                            )}
                          </Box>
                        </Grid>
                      </>
                    ) : (
                      <Grid size={12}>
                        <CircularLoading />
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid size={12}>
                    <ConnectAlert />
                  </Grid>
                )}

                <Grid size={12}>
                  <List>
                    {attempts.map((attempt, i) => (
                      <Fragment key={i}>
                        <ListItem>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Typography>
                              {t("gamemode.reactiontime.attempt")} {i + 1} :
                            </Typography>
                            <Typography sx={{ fontWeight: "bold" }}>
                              {attempt} ms
                            </Typography>
                          </Box>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </Fragment>
                    ))}
                  </List>
                </Grid>
                <Grid size={12} sx={{ mt: 3 }}>
                  <ButtonColor
                    value={Colors.colorApp}
                    label={t("commun.replay")}
                    variant="contained"
                    onClick={reset}
                  />
                </Grid>
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.red}
                    label={t("commun.leave")}
                    variant="contained"
                    onClick={() => navigate(-1)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
