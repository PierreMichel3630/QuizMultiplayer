import { Grid, Paper, Typography } from "@mui/material";
import { percent, viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { Question } from "src/models/Question";
import { NUMBERQUESTION } from "src/pages/PlayPage";
import { style } from "typestyle";
import { BadgeDifficulty } from "./Badge";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: viewHeight(20),
});

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
                <img src={question.image} className={imageCss} />
              </Grid>
            )}
            <Grid item xs={12}>
              <JsonLanguageBlock variant="h2" value={question.question} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Typography variant="h2">Load</Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
