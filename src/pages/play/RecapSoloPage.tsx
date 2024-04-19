import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Fragment, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ButtonColor } from "src/component/Button";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Question } from "src/models/Question";
import { Colors } from "src/style/Colors";

import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReplayIcon from "@mui/icons-material/Replay";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { ReportModal } from "src/component/modal/ReportModal";
import { launchSoloGame } from "src/api/game";
import { useUser } from "src/context/UserProvider";

export const RecapSoloPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { uuid } = useUser();

  const [question, setQuestion] = useState<Question | undefined>(undefined);

  const questions: Array<Question> = location.state
    ? location.state.questions
    : [];

  const theme = location.state ? location.state.theme : undefined;
  const score = location.state ? location.state.score : 0;
  const allquestion = location.state ? location.state.allquestion : false;

  const playSolo = () => {
    if (theme && uuid) {
      launchSoloGame(uuid, Number(theme.id)).then(({ data }) => {
        navigate(`/solo/${data.uuid}`);
      });
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.black,
        p: 0,
        minHeight: viewHeight(100),
      }}
    >
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>

      <Box
        sx={{
          p: 1,
          mb: px(180),
        }}
      >
        {location.state ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ScoreThemeBlock theme={theme} score={score} />
            </Grid>
            {allquestion && (
              <Grid item xs={12}>
                <Alert severity="warning">{t("alert.allresponseanswer")}</Alert>
              </Grid>
            )}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h1" color="text.secondary">
                {t("commun.questions")}
              </Typography>
            </Grid>
            {questions.map((el) => (
              <Fragment key={el.id}>
                <Grid item xs={12}>
                  <CardSignalQuestion
                    question={el}
                    report={() => setQuestion(el)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      borderBottomWidth: 5,
                      borderColor: Colors.white,
                      borderRadius: px(5),
                    }}
                  />
                </Grid>
              </Fragment>
            ))}
          </Grid>
        ) : (
          <Navigate to="/" replace />
        )}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              backgroundColor: Colors.black,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 1,
                flexDirection: "column",
              }}
            >
              <ButtonColor
                value={Colors.red}
                label={t("commun.tryagain")}
                icon={ReplayIcon}
                onClick={() => playSolo()}
                variant="contained"
              />
              <ButtonColor
                value={Colors.blue}
                label={t("commun.return")}
                icon={KeyboardReturnIcon}
                onClick={() => navigate(`/theme/${theme.id}`)}
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
          </Container>
        </Box>
      </Box>
      <ReportModal
        open={question !== undefined}
        close={() => setQuestion(undefined)}
        question={question}
      />
    </Container>
  );
};
