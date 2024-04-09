import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Question, QuestionDuel, QuestionSolo } from "src/models/Question";
import { NUMBERQUESTION } from "src/pages/PlayMultiPage";
import { BadgeDifficulty } from "./Badge";
import { ImageQuestionBlock } from "./ImageBlock";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CircularLoading } from "./Loading";
import { percent } from "csx";
import { Timer } from "./Timer";

interface Props {
  question?: Question;
}

export const QuestionBlock = ({ question }: Props) => {
  const { t } = useTranslation();
  return (
    <Paper sx={{ p: 1 }}>
      <Grid
        container
        spacing={2}
        sx={{ textAlign: "center" }}
        justifyContent="center"
      >
        {question ? (
          <>
            <Grid item xs={6} sx={{ textAlign: "left" }}>
              <Typography variant="h6">
                {t("commun.question")} {question.order}/{NUMBERQUESTION}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <BadgeDifficulty value={question.difficulty} />
            </Grid>
            {question.image && (
              <Grid item>
                <ImageQuestionBlock src={question.image} />
              </Grid>
            )}
            <Grid item xs={12}>
              <JsonLanguageBlock variant="h2" value={question.question} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <CircularLoading />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

interface PropsSolo {
  question?: QuestionSolo;
  timer?: number;
}

export const QuestionSoloBlock = ({ question, timer }: PropsSolo) => {
  return (
    <Box
      sx={{
        width: percent(100),
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {question ? (
        <>
          <JsonLanguageBlock
            variant="h2"
            color="text.secondary"
            sx={{ fontSize: 40 }}
            value={question.question}
          />
          {question.image && (
            <Box sx={{ flexGrow: 1, width: percent(100) }}>
              <ImageQuestionBlock src={question.image} />
            </Box>
          )}
          <Box
            sx={{
              width: percent(100),
              pb: 3,
            }}
          >
            {timer && <Timer time={timer} />}
          </Box>
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};

interface PropsDuel {
  question?: QuestionDuel;
}

export const QuestionDuelBlock = ({ question }: PropsDuel) => {
  return (
    <Box
      sx={{
        p: 1,
        width: percent(100),
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {question ? (
        <>
          <JsonLanguageBlock
            variant="h2"
            color="text.secondary"
            sx={{ fontSize: 40 }}
            value={question.question}
          />
          {question.image && (
            <Box sx={{ flexGrow: 1, width: percent(100) }}>
              <ImageQuestionBlock src={question.image} />
            </Box>
          )}
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};
