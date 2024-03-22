import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { launchSoloGame } from "src/api/game";
import { supabase } from "src/api/supabase";
import { selectThemeById } from "src/api/theme";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { QuestionSoloBlock } from "src/component/QuestionBlock";
import { ResponseSoloBlock } from "src/component/ResponseBlock";
import { Timer } from "src/component/Timer";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";
import { ResponseSolo } from "src/models/Response";
import { Theme } from "src/models/Theme";

import ReplayIcon from "@mui/icons-material/Replay";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { QcmBlock, QcmResponseBlock } from "src/component/QcmBlock";
import { MyScore } from "src/models/Score";

export const SoloPage = () => {
  const { t } = useTranslation();
  const { uuid, language } = useUser();
  const { themeid } = useParams();

  const [game, setGame] = useState<number | undefined>(undefined);
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | ResponseSolo>(undefined);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);

  useEffect(() => {
    const getMyRank = () => {
      if (theme) {
        selectScoreByThemeAndPlayer(uuid, theme.id).then(({ data }) => {
          const res = data as MyScore;
          setMyScore(res.id !== null ? res : undefined);
        });
      }
    };
    getMyRank();
  }, [theme, uuid]);

  useEffect(() => {
    const getTheme = async () => {
      if (themeid) {
        const { data } = await selectThemeById(Number(themeid));
        setTheme(data as Theme);
      }
    };
    getTheme();
  }, [themeid]);

  useEffect(() => {
    if (uuid && themeid) {
      const channel = supabase
        .channel(`${uuid}${themeid}`)
        .on("broadcast", { event: "question" }, (value) => {
          setQuestion(value.payload as QuestionSolo);
          setTimer(9);
          setResponse(undefined);
        })
        .on("broadcast", { event: "validate" }, (value) => {
          const res = value.payload as ResponseSolo;
          setTimer(undefined);
          setResponse(res);
          setScore(res.points);
        })
        .subscribe();
      setChannel(channel);
    }
  }, [uuid, themeid]);

  const validateResponse = async (value: string) => {
    if (channel && game && language) {
      channel.send({
        type: "broadcast",
        event: "response",
        payload: {
          response: value,
          language: language.iso,
        },
      });
    }
  };

  const launch = useCallback(async () => {
    if (uuid && themeid) {
      const { data } = await launchSoloGame(uuid, Number(themeid));
      setGame(data.id);
      setScore(0);
    }
  }, [uuid, themeid]);

  useEffect(() => {
    launch();
  }, [uuid, themeid, launch]);

  return (
    <Container maxWidth="sm" sx={{ p: 1, display: "flex", flex: "1 1 0%" }}>
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", gap: 1, flexDirection: "column" }}
        >
          {theme && (
            <Paper sx={{ p: 1 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={4}>
                  <ImageThemeBlock theme={theme} />
                </Grid>
                <Grid item xs={8}>
                  <JsonLanguageBlock
                    variant="h1"
                    sx={{ wordBreak: "break-all" }}
                    value={theme.name}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6">{t("commun.score")} : </Typography>
                    <Typography variant="h2">{score}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <QuestionSoloBlock question={question} />
            </Grid>
            <Grid item xs={12}>
              {timer && <Timer time={timer} />}
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: "column",
            }}
          >
            {response && (
              <>
                {question && question.isqcm ? (
                  <QcmResponseBlock
                    response={response}
                    responses={question.responses}
                  />
                ) : (
                  <ResponseSoloBlock response={response} />
                )}
              </>
            )}
            {response && !response.result ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => launch()}
                fullWidth
                startIcon={<ReplayIcon />}
              >
                <Typography variant="h2">{t("commun.tryagain")}</Typography>
              </Button>
            ) : (
              <>
                {!response && (
                  <>
                    {question && question.isqcm ? (
                      <QcmBlock
                        responses={question.responses}
                        onSubmit={validateResponse}
                      />
                    ) : (
                      <InputResponseBlock onSubmit={validateResponse} />
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
