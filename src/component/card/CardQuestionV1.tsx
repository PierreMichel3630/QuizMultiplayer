import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { JsonLanguage } from "src/models/Language";
import { QuestionResultV1 } from "src/models/Question";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ImageQCMBlock, ImageQuestionBlock } from "../ImageBlock";
import {
  JsonLanguageArrayOrStringBlock,
  JsonLanguageBlock,
} from "../JsonLanguageBlock";
import { MapPositionBlock } from "../MapPositionBlock";
import { ExtraResponseBlock } from "../response/ExtraResponseBlock";

import BugReportIcon from "@mui/icons-material/BugReport";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

interface PropsCardSignalQuestionV1 {
  question: QuestionResultV1;
  report?: () => void;
  color?: string;
}
export const CardSignalQuestionV1 = ({
  question,
  report,
  color = "text.primary",
}: PropsCardSignalQuestionV1) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: 1,
        height: percent(100),
        position: "relative",
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <JsonLanguageBlock
            variant="h2"
            color={color}
            value={question.question}
          />
        </Grid>
        {question.extra && (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <JsonLanguageBlock
              variant="caption"
              color={color}
              sx={{
                fontSize: 18,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          </Grid>
        )}
        {question.typequestion === "MAPPOSITION" && question.data !== null && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <MapPositionBlock data={question.data} height={300} />
          </Grid>
        )}
        {question.image && (
          <Grid item xs={12} sx={{ maxWidth: percent(80), maxHeight: px(300) }}>
            <ImageQuestionBlock src={question.image} />
          </Grid>
        )}
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          {question.isqcm ? (
            <QcmBlockDuelResultBlockV1 question={question} />
          ) : (
            <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              {!question.responsePlayer1 && !question.responsePlayer2 && (
                <Paper
                  sx={{
                    p: "4px 10px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    cursor: "default",
                    borderColor: Colors.white,
                    borderStyle: "solid",
                    borderWidth: 1,
                    backgroundColor: question.resultPlayer1
                      ? Colors.correctanswer
                      : Colors.wronganswer,
                    userSelect: "none",
                  }}
                >
                  <Box>
                    <Typography variant="h6" color={color} component="span">
                      {`${t("commun.goodresponse")} :   `}
                    </Typography>
                    <JsonLanguageArrayOrStringBlock
                      component="span"
                      color={color}
                      variant="h2"
                      all={question.allresponse}
                      value={question.response as JsonLanguage}
                    />
                  </Box>
                </Paper>
              )}
              {question.responsePlayer1 && (
                <Paper
                  sx={{
                    p: "4px 10px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    cursor: "default",
                    borderColor: Colors.white,
                    borderStyle: "solid",
                    borderWidth: 1,
                    backgroundColor: question.resultPlayer1
                      ? Colors.correctanswer
                      : Colors.wronganswer,
                    userSelect: "none",
                  }}
                >
                  <Typography
                    variant="h2"
                    color={color}
                    sx={{ wordWrap: "break-word" }}
                  >
                    {question.responsePlayer1}
                  </Typography>
                  <Box>
                    <Typography variant="h6" color={color} component="span">
                      {`${t("commun.goodresponse")} :   `}
                    </Typography>
                    <JsonLanguageArrayOrStringBlock
                      component="span"
                      color={color}
                      variant="h2"
                      all={question.allresponse}
                      value={question.response as JsonLanguage}
                    />
                  </Box>
                </Paper>
              )}
              {question.responsePlayer2 && (
                <Paper
                  sx={{
                    p: "4px 10px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    cursor: "default",
                    borderColor: Colors.white,
                    borderStyle: "solid",
                    borderWidth: 1,
                    backgroundColor: question.resultPlayer1
                      ? Colors.correctanswer
                      : Colors.wronganswer,
                    userSelect: "none",
                  }}
                >
                  <Typography
                    variant="h2"
                    color={color}
                    sx={{ wordWrap: "break-word" }}
                  >
                    {question.responsePlayer2}
                  </Typography>
                  <Box>
                    <Typography variant="h6" color={color} component="span">
                      {`${t("commun.goodresponse")} :   `}
                    </Typography>
                    <JsonLanguageArrayOrStringBlock
                      component="span"
                      color={color}
                      variant="h2"
                      all={question.allresponse}
                      value={question.response as JsonLanguage}
                    />
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </Grid>
        {report && (
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.yellow}
              label={t("commun.report")}
              icon={BugReportIcon}
              onClick={report}
              variant="contained"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

interface PropsQcmBlockDuelResultBlockV1 {
  question: QuestionResultV1;
}

export const QcmBlockDuelResultBlockV1 = ({
  question,
}: PropsQcmBlockDuelResultBlockV1) => {
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const response = question.response;

  const responsePlayer1 = question.responsePlayer1;
  const responsePlayer2 = question.responsePlayer2;

  const columns = useMemo(() => {
    const modulo = question.responses.length % 2;
    return modulo === 0 ? 2 : 1;
  }, [question.responses.length]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        gap: px(4),
      }}
    >
      {question.responses.map((res, index) => {
        const isCorrectResponse = Number(response) === index;

        const isArrowRight =
          responsePlayer1 !== undefined && Number(responsePlayer1) === index;
        const isArrowLeft =
          responsePlayer2 !== undefined && Number(responsePlayer2) === index;
        let color: string = isDarkMode ? Colors.black2 : Colors.white;
        const arrowColor: string = isDarkMode ? Colors.white : Colors.black2;
        let borderColor: string = isDarkMode ? Colors.white : Colors.black2;

        if (isCorrectResponse) {
          color = Colors.green;
          borderColor = Colors.white;
        } else if (isArrowRight || isArrowLeft) {
          color = Colors.red;
          borderColor = Colors.white;
        }

        return (
          <Paper
            key={index}
            sx={{
              p: "4px 10px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "default",
              borderColor: borderColor,
              borderStyle: "solid",
              borderWidth: 1,
              backgroundColor: color,
              height: percent(100),
              userSelect: "none",
              minHeight: px(50),
            }}
          >
            {isArrowRight && (
              <ArrowRightIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: arrowColor,
                }}
              />
            )}
            <Box>
              {res.image && <ImageQCMBlock src={res.image} />}
              {res.label && (
                <JsonLanguageBlock variant="h3" value={res.label} />
              )}
              {res.extra && (
                <ExtraResponseBlock extra={res.extra} shadow={false} />
              )}
            </Box>
            {isArrowLeft && (
              <ArrowLeftIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  right: 0,
                  color: arrowColor,
                }}
              />
            )}
          </Paper>
        );
      })}
    </Box>
  );
};
