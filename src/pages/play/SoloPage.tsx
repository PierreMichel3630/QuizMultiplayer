import { Box, Container, Grid, Typography } from "@mui/material";
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
import { viewHeight } from "csx";
import { ButtonColor } from "src/component/Button";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { QcmBlock, QcmResponseBlock } from "src/component/QcmBlock";
import { Colors } from "src/style/Colors";

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
          setTimer(14);
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

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
        p: 0,
        backgroundColor: Colors.black,
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
          <Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={4} sm={3} md={2}>
                <ImageThemeBlock theme={theme} />
              </Grid>
              <Grid item xs={8} sm={9} md={10}>
                <JsonLanguageBlock
                  variant="h1"
                  color="text.secondary"
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
                  <Typography variant="h6" color="text.secondary">
                    {t("commun.score")} :{" "}
                  </Typography>
                  <Typography variant="h2" color="text.secondary">
                    {score}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
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
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexDirection: "column" }}>
            <ButtonColor
              value={Colors.red}
              label={t("commun.tryagain")}
              icon={ReplayIcon}
              onClick={() => launch()}
              variant="contained"
            />
            <ButtonColor
              value={Colors.blue}
              label={t("commun.return")}
              icon={KeyboardReturnIcon}
              onClick={() => navigate(-1)}
              variant="contained"
            />
            <ButtonColor
              value={Colors.green}
              label={t("commun.returnhome")}
              icon={HomeIcon}
              onClick={() => navigate("/")}
              variant="contained"
            />
          </Box>
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
