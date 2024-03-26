import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { launchSoloGame } from "src/api/game";
import { supabase } from "src/api/supabase";
import { selectThemeById } from "src/api/theme";
import { InputResponseBlock } from "src/component/InputResponseBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { QuestionSoloBlock } from "src/component/QuestionBlock";
import { ResponseSoloBlock } from "src/component/ResponseBlock";
import { useUser } from "src/context/UserProvider";
import { QuestionSolo } from "src/models/Question";
import { ResponseSolo } from "src/models/Response";
import { Theme } from "src/models/Theme";

import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReplayIcon from "@mui/icons-material/Replay";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { QcmBlock, QcmResponseBlock } from "src/component/QcmBlock";
import { viewHeight } from "csx";

export const SoloPage = () => {
  const { t } = useTranslation();
  const { uuid, language } = useUser();
  const { themeid } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<number | undefined>(undefined);
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(
    undefined
  );

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [question, setQuestion] = useState<undefined | QuestionSolo>(undefined);
  const [response, setResponse] = useState<undefined | ResponseSolo>(undefined);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<undefined | number>(undefined);

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
          scrollTop();
        })
        .on("broadcast", { event: "validate" }, (value) => {
          const res = value.payload as ResponseSolo;
          setTimer(undefined);
          setResponse(res);
          setScore(res.points);
          scrollTop();
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

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const isInputDisplay = question && !question.isqcm && !response;

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 0%",
          p: 1,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Helmet>
          <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
        </Helmet>
        {theme && (
          <Paper
            sx={{
              p: 1,
              display: { xs: isInputDisplay ? "none" : "block", sm: "block" },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={4} sm={3} md={2}>
                <ImageThemeBlock theme={theme} />
              </Grid>
              <Grid item xs={8} sm={9} md={10}>
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

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <QuestionSoloBlock question={question} timer={timer} />

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
        </Box>
        {response && !response.result ? (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => launch()}
              fullWidth
              startIcon={<ReplayIcon color="secondary" />}
            >
              <Typography variant="h2" color="text.primary">
                {t("commun.tryagain")}
              </Typography>
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
              fullWidth
              startIcon={<KeyboardReturnIcon color="secondary" />}
            >
              <Typography variant="h2" color="text.primary">
                {t("commun.return")}
              </Typography>
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              fullWidth
              startIcon={<HomeIcon color="secondary" />}
            >
              <Typography variant="h2" color="text.primary">
                {t("commun.returnhome")}
              </Typography>
            </Button>
          </>
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
    </Container>
  );
};
