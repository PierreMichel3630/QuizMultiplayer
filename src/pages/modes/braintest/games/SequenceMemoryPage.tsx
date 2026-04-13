import { Container, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { important, px } from "csx";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { TitleBlock } from "src/component/title/Title";
import { Colors } from "src/style/Colors";

import { useNavigate } from "react-router-dom";
import { saveGameModeScore } from "src/api/gamemode";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { ChangeNumberBlock } from "src/component/ChangeBlock";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { CircularLoading } from "src/component/Loading";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { RankingGameMode } from "src/component/ranking/gamemode/RankingGameMode";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { GameModeScore, ResultGameModeScore } from "src/models/GameMode";
import { GameModeDialog } from "src/component/modal/gamemode/GameModeModal";

enum StatusGame {
  NOTSTART = "NOTSTART",
  PLAY = "PLAY",
  WAIT = "WAIT",
  ANSWER = "ANSWER",
  FINISH = "FINISH",
}
export default function SequenceMemoryPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const type = TypeGameMode.sequencememory;

  const [isLandscape, setIsLandscape] = useState(false);
  const [score, setScore] = useState(0);

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
  const [dataResult, setDataResult] = useState<null | ResultGameModeScore>(
    null,
  );

  const [sequence, setSequence] = useState<Array<number>>([]);
  const [userSequence, setUserSequence] = useState<Array<number>>([]);
  const [activeSquare, setActiveSquare] = useState<null | number>(null);
  const [isDisplaying, setIsDisplaying] = useState(false);

  const [data, setData] = useState<GameModeScore | undefined>(undefined);

  const observerRef = useRef<ResizeObserver | null>(null);
  const measuredRef = (node: HTMLDivElement | null) => {
    if (node === null) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    } else {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setIsLandscape(width > height);
        }
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  };

  const nextLevel = (currentSeq = sequence) => {
    const nextStep = Math.floor(Math.random() * 9);
    const newSeq = [...currentSeq, nextStep];
    setSequence(newSeq);
    setUserSequence([]);
    setTimeout(() => playSequence(newSeq), 500);
  };

  const playSequence = async (seq: Array<number>) => {
    setIsDisplaying(true);
    for (const element of seq) {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Pause entre
      setActiveSquare(element);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Temps d'allumage
      setActiveSquare(null);
    }
    setIsDisplaying(false);
  };

  const handleSquareClick = (index: number) => {
    setActiveSquare(index);
    setTimeout(() => setActiveSquare(null), 150);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Vérification immédiate du dernier clic
    if (index !== sequence[newUserSequence.length - 1]) {
      setStatusGame(StatusGame.FINISH);
      if (profile) {
        saveGameModeScore(score, type).then(({ data }) => {
          setTimeout(() => setDataResult(data), 5000);
        });
      }
      return;
    }

    // Si la séquence est complétée
    if (newUserSequence.length === sequence.length) {
      setScore((prev) => prev + 1);
      nextLevel();
    }
  };

  const reset = () => {
    setScore(0);
    setSequence([]);
    setUserSequence([]);
    setStatusGame(StatusGame.PLAY);
  };

  const newGame = () => {
    reset();
    nextLevel([]);
    setDataResult(null);
  };

  const getDetail = (data: GameModeScore) => {
    setData(data);
  };

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.braintest.title")} - ${t("appname")}`}</title>
        </Helmet>

        <Grid size={12}>
          {statusGame === StatusGame.PLAY && (
            <Box
              sx={{
                p: 3,
                gap: 4,
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
              }}
              ref={measuredRef}
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
                  {t("gamemode.score")} :
                </Typography>
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {score}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: isLandscape ? "auto" : "100%",
                    height: isLandscape ? "100%" : "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    aspectRatio: 1,
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridTemplateRows: "repeat(3, 1fr)",
                      gap: 3,
                    }}
                  >
                    {[...Array(9)].map((_, index) => (
                      <Box
                        key={index}
                        onClick={() =>
                          !isDisplaying && handleSquareClick(index)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            activeSquare === index
                              ? Colors.white
                              : Colors.grey5,
                          borderRadius: px(10),
                          border: "3px solid",
                          borderColor: Colors.grey5,
                          color: "white",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          cursor: isDisplaying ? "default" : "pointer",
                          transition: "background-color 0.2s",
                          transform:
                            "0.3s ease-out, opacity 0.3s ease-out, background 0.3s ease-out",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          {statusGame === StatusGame.NOTSTART && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <TitleBlock title={t("gamemode.sequencememory.name")} />
                </Grid>
                <Grid size={12}>
                  <Typography fontSize={15}>
                    {t("gamemode.sequencememory.rules")}
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
                    onClick={newGame}
                  />
                </Grid>
                <Grid size={12}>
                  <RankingGameMode
                    type={type}
                    asc={false}
                    onClick={getDetail}
                  />
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
                    alignItems: "flex-start",
                    flexDirection: "column",
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
                        {t("gamemode.myrecord")} :
                      </Typography>
                      <Typography
                        variant="h3"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {dataResult?.result.score}
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
                      {t("gamemode.score")} :
                    </Typography>
                    <Typography
                      variant="h3"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {score}
                    </Typography>
                    {dataResult?.previousScore && (
                      <ChangeNumberBlock
                        value={score}
                        previous={dataResult?.previousScore.score}
                        variant="h6"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.colorApp}
                    label={t("commun.replay")}
                    variant="contained"
                    onClick={newGame}
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
      <GameModeDialog
        open={data !== undefined}
        close={() => setData(undefined)}
        data={data}
      />
    </Container>
  );
}
