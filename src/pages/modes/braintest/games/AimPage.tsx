import { Typography } from "@mui/material";
import { Box, Container, Grid } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { saveGameModeScore } from "src/api/gamemode";
import { AimDetailDialog } from "src/component/modal/gamemode/GameModeModal";
import { NotStartGameMode } from "src/component/ranking/gamemode/NotStartGameMode";
import { ResultGameMode } from "src/component/ranking/gamemode/ResultGameMode";

import { Target } from "src/component/svg/Target";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { GameModeScore, ResultGameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";

const TARGETS_TOTAL = 20;
const TARGET_RADIUS = 40;
const TARGET_SIZE = TARGET_RADIUS * 2;

interface TargetPosition {
  x: number;
  y: number;
}

export interface TargetResult extends TargetPosition {
  time: number;
}
enum StatusGame {
  NOTSTART = "NOTSTART",
  PLAY = "PLAY",
  FINISH = "FINISH",
}

export default function AimPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);

  const type = TypeGameMode.aimtrainer;
  const unit = "ms";
  const order = Order.ASC;
  const fixed = 2;

  const [targets, setTargets] = useState<Array<TargetResult>>([]);
  const [target, setTarget] = useState<TargetPosition | undefined>(undefined);

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
  const [dataResult, setDataResult] = useState<null | ResultGameModeScore>(
    null,
  );

  const [data, setData] = useState<GameModeScore | undefined>(undefined);

  const startTimeRef = useRef<number>(0);

  const reset = () => {
    setDataResult(null);
    setTargets([]);
    launch();
  };

  const launch = () => {
    setStatusGame(StatusGame.PLAY);
  };

  const generateTarget = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const maxX = rect.width - TARGET_SIZE;
    const maxY = rect.height - TARGET_SIZE;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    setTarget({ x, y });
  };

  useEffect(() => {
    if (statusGame === StatusGame.PLAY) {
      generateTarget();
    }
  }, [statusGame]);

  useEffect(() => {
    if (target) {
      requestAnimationFrame(() => {
        startTimeRef.current = performance.now();
      });
    }
  }, [target]);

  const handleClick = () => {
    const endTime = performance.now();
    const diff = endTime - startTimeRef.current;
    const roundedDiff = Math.round(diff * 100) / 100;

    const newTargets: Array<TargetResult> = [
      ...targets,
      {
        x: target?.x ?? 0,
        y: target?.y ?? 0,
        time: roundedDiff,
      },
    ];

    setTargets(newTargets);

    if (newTargets.length >= TARGETS_TOTAL) {
      const result =
        [...newTargets].reduce((acc, value) => acc + value.time, 0) /
        TARGETS_TOTAL;
      setStatusGame(StatusGame.FINISH);
      if (profile) {
        const rect = containerRef.current?.getBoundingClientRect();
        const extra = rect
          ? {
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              targets: newTargets,
            }
          : { targets: newTargets };
        saveGameModeScore(result, type, Order.DESC, extra).then(({ data }) => {
          setDataResult(data);
        });
      }
    } else {
      generateTarget();
    }
  };

  const getDetail = (data: GameModeScore) => {
    setData(data);
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
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography variant="h6">
                  {t("gamemode.aimtrainer.targettouch")} :
                </Typography>
                <Typography variant="h2">
                  {targets.length}/{TARGETS_TOTAL}
                </Typography>
              </Box>
              <Box
                ref={containerRef}
                sx={{
                  flex: 1,
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? Colors.white
                      : Colors.black,
                }}
              >
                {target && (
                  <Target
                    size={TARGET_SIZE}
                    transform={`translate(${target.x}, ${target.y})`}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleClick();
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
          {statusGame === StatusGame.NOTSTART && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <NotStartGameMode
                type={type}
                newGame={reset}
                getDetail={getDetail}
                order={order}
                unit={unit}
                fixed={fixed}
              />
            </Box>
          )}

          {statusGame === StatusGame.FINISH && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <ResultGameMode
                result={dataResult}
                order={order}
                onLeave={() => setStatusGame(StatusGame.NOTSTART)}
                onNewGame={reset}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      <AimDetailDialog
        open={data !== undefined}
        close={() => setData(undefined)}
        data={data}
        unit={unit}
        fixed={fixed}
      />
    </Container>
  );
}
