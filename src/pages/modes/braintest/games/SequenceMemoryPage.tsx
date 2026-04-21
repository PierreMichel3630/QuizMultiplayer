import { Container, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { px } from "csx";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

import { saveGameModeScore } from "src/api/gamemode";
import { NotStartGameMode } from "src/component/ranking/gamemode/NotStartGameMode";
import { ResultGameMode } from "src/component/ranking/gamemode/ResultGameMode";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { ResultGameModeScore } from "src/models/GameMode";

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

  const type = TypeGameMode.sequencememory;
  const order = Order.DESC;

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
        saveGameModeScore(score, type, order).then(({ data }) => {
          setDataResult(data);
        });
      } else {
        setDataResult({
          hasrecord: false,
          result: {
            type: type,
            score: score,
          },
          previousScore: null,
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
              <NotStartGameMode order={order} type={type} newGame={newGame} />
            </Box>
          )}

          {statusGame === StatusGame.FINISH && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <ResultGameMode
                type={type}
                result={dataResult}
                order={order}
                onLeave={() => setStatusGame(StatusGame.NOTSTART)}
                onNewGame={newGame}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
