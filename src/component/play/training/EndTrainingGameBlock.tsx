import { Box, Grid, Alert, Divider, Container } from "@mui/material";
import { percent, px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ButtonColor } from "src/component/Button";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { ReportModal } from "src/component/modal/ReportModal";
import { TrainingGame } from "src/models/Game";
import { QuestionResult } from "src/models/Question";
import { Colors } from "src/style/Colors";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

interface Props {
  isAllQuestion?: boolean;
  questions: Array<QuestionResult>;
  game?: TrainingGame;
}

export const EndTrainingGameBlock = ({
  questions,
  game,
  isAllQuestion = false,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [maxIndex, setMaxIndex] = useState(5);
  const [questionReport, setQuestionReport] = useState<
    undefined | QuestionResult
  >(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
          document.documentElement.offsetHeight ||
        questions.length <= maxIndex
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 2);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [questions, maxIndex]);

  const questionsDisplay = useMemo(() => {
    return [...questions].splice(0, maxIndex);
  }, [questions, maxIndex]);

  return (
    <Box sx={{ display: "flex", width: percent(100), mb: 6 }}>
      <Grid container spacing={1}>
        {isAllQuestion && (
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ width: percent(100) }}>
              {t("alert.allresponseanswer")}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider
            sx={{
              borderBottomWidth: 5,
              borderColor: Colors.white,
              borderRadius: px(5),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {questionsDisplay.map((el, index) => (
              <Fragment key={index}>
                <Grid item xs={12}>
                  <CardSignalQuestion
                    question={el}
                    report={() => setQuestionReport(el)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      borderBottomWidth: 5,
                      borderRadius: px(5),
                    }}
                  />
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              backgroundColor: "background.paper",
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
                label={t("commun.leave")}
                icon={ExitToAppIcon}
                onClick={() =>
                  game ? navigate(`/theme/${game.theme.id}`) : navigate(-1)
                }
                variant="contained"
              />
            </Box>
          </Container>
        </Box>
      </Grid>
      <ReportModal
        open={questionReport !== undefined}
        close={() => setQuestionReport(undefined)}
        question={questionReport}
      />
    </Box>
  );
};
