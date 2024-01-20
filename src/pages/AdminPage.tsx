import { Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useState } from "react";
import { selectQuestionWithImage } from "src/api/question";
import { QuestionAdmin } from "src/models/Question";
import { style } from "typestyle";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: px(200),
});

export const AdminPage = () => {
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);

  useEffect(() => {
    selectQuestionWithImage().then(({ data }) => {
      setQuestions(data as Array<QuestionAdmin>);
    });
  }, []);
  return (
    <Grid container spacing={1}>
      {questions
        .sort((a, b) => a.id - b.id)
        .map((question) => (
          <Grid item xs={3}>
            <Box>
              <img src={question.image} className={imageCss} />
              <Typography>{question.id}</Typography>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
