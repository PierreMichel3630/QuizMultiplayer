import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { EndGame } from "src/models/EndGame";
import { NUMBERQUESTION } from "src/pages/PlayPage";
import { style } from "typestyle";
import { BadgeDifficulty } from "./Badge";
import {
  JsonLanguageArrayOrStringBlock,
  JsonLanguageBlock,
} from "./JsonLanguageBlock";
import { Colors } from "src/style/Colors";
import { QuestionPosition } from "src/models/Question";

const imageCss = style({
  maxWidth: percent(50),
  maxHeight: px(150),
});

interface Props {
  endGame: EndGame;
  questionsPosition: Array<QuestionPosition>;
}

export const EndGameBlock = ({ endGame, questionsPosition }: Props) => {
  const { t } = useTranslation();

  const getColor = (questionsPosition?: QuestionPosition) => {
    let color: string = Colors.grey;
    if (questionsPosition && questionsPosition.isRight) {
      color = Colors.green;
    } else if (questionsPosition && !questionsPosition.isRight) {
      color = Colors.red;
    }
    return color;
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        minHeight: 0,
        flexDirection: "column",
        flex: "1 1 0",
      }}
    >
      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          pr: 2,
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: px(5),
            minHeight: 0,
          }}
        >
          {endGame.questions.map((question, index) => {
            const questionPosition = questionsPosition.find(
              (el) => index + 1 === el.question
            );
            return (
              <Paper sx={{ p: 1 }} key={index}>
                <Grid
                  container
                  spacing={2}
                  sx={{ textAlign: "center" }}
                  justifyContent="center"
                >
                  <Grid item xs={6} sx={{ textAlign: "left" }}>
                    <Typography variant="h6">
                      {t("commun.question")} {index + 1}/{NUMBERQUESTION}
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
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 1,
                        backgroundColor: getColor(questionPosition),
                        borderRadius: px(10),
                        textAlign: "center",
                        width: percent(100),
                      }}
                    >
                      <JsonLanguageArrayOrStringBlock
                        variant="h4"
                        sx={{ color: "white" }}
                        value={question.response}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
