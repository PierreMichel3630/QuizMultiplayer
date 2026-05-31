import { Divider, Typography } from "@mui/material";
import { Box, Container, Grid } from "@mui/system";
import { percent } from "csx";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { saveGameModeScore } from "src/api/gamemode";
import { NotStartGameMode } from "src/component/ranking/gamemode/NotStartGameMode";
import { ResultGameMode } from "src/component/ranking/gamemode/ResultGameMode";

import { Target } from "src/component/svg/Target";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { ResultGameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";
import { scaleToMax } from "src/utils/scale";

const TARGETS_TOTAL = 20;
const TARGET_RADIUS = 40;
const TARGET_SIZE = TARGET_RADIUS * 2;

interface TargetPosition {
  x: number;
  y: number;
}

interface ExtraValue {
  width?: number;
  height?: number;
  targets: Array<TargetResult>;
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
      const rect = containerRef.current?.getBoundingClientRect();
      const extra = rect
        ? {
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            targets: newTargets,
          }
        : { targets: newTargets };
      if (profile) {
        saveGameModeScore(result, type, order, extra).then(({ data }) => {
          setDataResult(data);
        });
      } else {
        setDataResult({
          hasrecord: false,
          result: {
            type: type,
            score: result,
            extra,
          },
          previousScore: null,
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
                  <Box
                    sx={{
                      position: "absolute",
                      left: target.x,
                      top: target.y,
                      width: TARGET_SIZE,
                      height: TARGET_SIZE,
                    }}
                  >
                    <Target
                      size={TARGET_SIZE}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleClick();
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {statusGame === StatusGame.NOTSTART && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <NotStartGameMode
                type={type}
                newGame={reset}
                order={order}
                unit={unit}
                fixed={fixed}
              />
            </Box>
          )}

          {statusGame === StatusGame.FINISH && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <ResultGameMode
                type={type}
                result={dataResult}
                order={order}
                unit={unit}
                fixed={fixed}
                onLeave={() => setStatusGame(StatusGame.NOTSTART)}
                onNewGame={reset}
                extra={<ExtraAim value={dataResult?.result.extra} />}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

interface PropsExtraAim {
  value?: ExtraValue;
}

export const ExtraAim = ({ value }: PropsExtraAim) => {
  const { t } = useTranslation();

  const previewSize = useMemo(
    () =>
      value?.width && value?.height
        ? scaleToMax({
            width: value.width ?? 100,
            height: value.height ?? 100,
          })
        : undefined,
    [value],
  );

  const previewSizeGlobal = useMemo(
    () =>
      value?.width && value?.height
        ? scaleToMax(
            {
              width: value.width ?? 100,
              height: value.height ?? 100,
            },
            400,
          )
        : undefined,
    [value],
  );

  return (
    value && (
      <Grid container spacing={1}>
        {value.width && value.height && (
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Typography variant="body1" component="span">
              {t("gamemode.aimtrainer.screensize")} :
            </Typography>
            <Typography variant="h6" component="span">
              {"  "}
              {value.width} x {value.height}
            </Typography>
          </Grid>
        )}
        {value.targets !== undefined &&
          previewSize &&
          value?.width !== undefined &&
          value?.height !== undefined && (
            <>
              {value.targets.map((target, i) => {
                const left = (target.x / value.width!) * previewSize.width;
                const top = (target.y / value.height!) * previewSize.height;
                return (
                  <Fragment key={i}>
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4">
                            {t("gamemode.aimtrainer.target")} {i + 1}
                          </Typography>
                          <Box>
                            <Typography component="span">
                              {t("commun.targetposition")} :
                            </Typography>
                            <Typography variant="h6" component="span">
                              {"  "}
                              {target.x.toFixed(2)} x {target.y.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography component="span">
                              {t("commun.time")} :
                            </Typography>
                            <Typography variant="h6" component="span">
                              {"  "} {target.time.toFixed(2)} ms
                            </Typography>
                          </Box>
                        </Box>
                        {value.width && value.height && (
                          <Box
                            sx={{
                              position: "relative",
                              width: previewSize.width,
                              height: previewSize.height,
                              border: "1px solid #ccc",
                              backgroundColor: "#f5f5f5",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: left,
                                top: top,
                                borderRadius: percent(50),
                                backgroundColor: Colors.red,
                                width: 80 * previewSize.scale,
                                height: 80 * previewSize.scale,
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <Divider />
                    </Grid>
                  </Fragment>
                );
              })}
            </>
          )}

        {previewSizeGlobal && value.targets && (
          <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                position: "relative",
                width: previewSizeGlobal.width,
                height: previewSizeGlobal.height,
                border: "1px solid #ccc",
                backgroundColor: "#f5f5f5",
              }}
            >
              {value.targets.map((target, i) => {
                const left =
                  (target.x / value.width!) * previewSizeGlobal.width;
                const top =
                  (target.y / value.height!) * previewSizeGlobal.height;
                return (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      left: left,
                      top: top,
                      borderRadius: percent(50),
                      backgroundColor: Colors.red,
                      width: 80 * previewSizeGlobal.scale,
                      height: 80 * previewSizeGlobal.scale,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">{i + 1}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        )}
      </Grid>
    )
  );
};
