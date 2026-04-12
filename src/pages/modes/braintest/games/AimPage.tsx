import { Typography } from "@mui/material";
import { Box, Container, Grid } from "@mui/system";
import { important, px } from "csx";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { saveGameModeScore } from "src/api/gamemode";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { ButtonColor } from "src/component/Button";
import { ChangeNumberBlock } from "src/component/ChangeBlock";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { CircularLoading } from "src/component/Loading";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { RankingGameMode } from "src/component/ranking/gamemode/RankingGameMode";

import { Target } from "src/component/svg/Target";
import { TitleBlock } from "src/component/title/Title";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { ResultGameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";

const TARGETS_TOTAL = 20;
const TARGET_RADIUS = 40;
const TARGET_SIZE = TARGET_RADIUS * 2;

enum StatusGame {
  NOTSTART = "NOTSTART",
  PLAY = "PLAY",
  FINISH = "FINISH",
}

export default function AimPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  const type = TypeGameMode.aimtrainer;

  const [score, setScore] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);
  const [target, setTarget] = useState({ x: 200, y: 200 });

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
  const [dataResult, setDataResult] = useState<null | ResultGameModeScore>(
    null,
  );

  const startTimeRef = useRef<number>(0);

  const reset = () => {
    setDataResult(null);
    setTargetsHit(0);
    launch();
  };

  const launch = () => {
    setStatusGame(StatusGame.PLAY);
    startTimeRef.current = performance.now();
  };

  useEffect(() => {
    generateTarget();
  }, []);

  const generateTarget = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const maxX = rect.width - TARGET_SIZE;
    const maxY = rect.height - TARGET_SIZE;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    setTarget({ x, y });
  };

  const handleClick = () => {
    const endTime = performance.now();

    const newCount = targetsHit + 1;
    setTargetsHit(newCount);

    if (newCount >= TARGETS_TOTAL) {
      const diff = endTime - startTimeRef.current;
      const result = diff / TARGETS_TOTAL;
      setScore(result);
      setStatusGame(StatusGame.FINISH);
      if (profile) {
        const rect = containerRef.current?.getBoundingClientRect();
        const extra = rect ? { width: Math.round(rect.width), height: Math.round(rect.height)} : null
        saveGameModeScore(result, type, Order.DESC, extra).then(({ data }) => {
          setDataResult(data);
        });
      }
    } else {
      generateTarget();
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
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{p: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1}}>
                <Typography variant="h6">
                  {t("gamemode.aimtrainer.targettouch")} :
                </Typography>
                <Typography variant="h2">
                  {targetsHit}/{TARGETS_TOTAL}
                </Typography>
              </Box>
              <Box ref={containerRef} sx={{ flex: 1 }}>
                <Target
                  size={TARGET_SIZE}
                  transform={`translate(${target.x}, ${target.y})`}
                  onClick={() => handleClick()}
                />
              </Box>
            </Box>
          )}
          {statusGame === StatusGame.NOTSTART && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <TitleBlock title={t("gamemode.aimtrainer.name")} />
                </Grid>
                <Grid size={12}>
                  <Typography fontSize={15}>
                    {t("gamemode.aimtrainer.rules")}
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
                    onClick={reset}
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
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  {dataResult?.result.score && (
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
                        {dataResult?.result.score}ms
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {t("gamemode.aimtrainer.score")} :
                    </Typography>
                    <Typography
                      variant="h3"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {score}ms
                    </Typography>
                    {dataResult?.previousScore && (
                      <ChangeNumberBlock
                        value={score}
                        previous={dataResult?.result.score}
                        variant="h6"
                        order={Order.DESC}
                        unit="ms"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={12}>
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
