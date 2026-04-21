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
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
  ERROR = "ERROR",
  FINISH = "FINISH",
}
export default function ReactionTimePage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const MAX_ATTEMPTS = 5;
  const type = TypeGameMode.reactiontime;
  const unit = "ms";
  const order = Order.ASC;
  const fixed = 2;

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
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
      const roundedDiff = Math.round(diff * 100) / 100;

      setReactionTime(roundedDiff);

      const newAttempts = [...attempts, roundedDiff];
      setAttempts(newAttempts);

      if (newAttempts.length === MAX_ATTEMPTS) {
        const result =
          newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
        setStatusGame(StatusGame.FINISH);
        const extra = {
          attempts: newAttempts,
        };
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
                width: "100dvw",
                height: "100dvh",
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
                height: "100dvh",
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
                height: "100dvh",
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
                fixed={2}
                onLeave={() => setStatusGame(StatusGame.NOTSTART)}
                onNewGame={reset}
                extra={<ExtraReactionTime attempts={attempts} fixed={fixed} />}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

interface PropsExtraReactionTime {
  attempts: Array<number>;
  fixed: number;
}

export const ExtraReactionTime = ({
  attempts,
  fixed,
}: PropsExtraReactionTime) => {
  const { t } = useTranslation();
  return (
    attempts.length > 0 && (
      <List>
        {attempts.map((attempt, i) => (
          <Fragment key={i}>
            <ListItem>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography>
                  {t("gamemode.reactiontime.attempt")} {i + 1} :
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {attempt.toFixed(0)} ms
                </Typography>
              </Box>
            </ListItem>
            <Divider variant="inset" component="li" />
          </Fragment>
        ))}
        <ListItem sx={{ display: "flex", justifyContent: "center" }}>
          <Box>
            <Typography variant="subtitle2" component="span">
              {t("commun.average")} :{" "}
            </Typography>
            <Typography variant="h4" component="span">
              {(
                attempts.reduce((acc, v) => acc + v, 0) / attempts.length
              ).toFixed(fixed)}{" "}
              ms
            </Typography>
          </Box>
        </ListItem>
      </List>
    )
  );
};
