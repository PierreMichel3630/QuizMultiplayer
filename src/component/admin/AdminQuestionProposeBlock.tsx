import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { selectQuestionsPropose } from "src/api/question";
import { QuestionAdmin } from "src/models/Question";

import { CardAdminQuestion } from "../card/CardQuestion";

export const AdminQuestionProposeBlock = () => {
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);

  const getQuestionsPropose = () => {
    selectQuestionsPropose().then(({ data }) => {
      setQuestions(data ?? []);
    });
  };

  useEffect(() => {
    getQuestionsPropose();
  }, []);

  return (
    <Grid container spacing={1}>
      {questions.map((question, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 4
          }}>
          <CardAdminQuestion
            question={question}
            refresh={() => getQuestionsPropose()}
          />
        </Grid>
      ))}
    </Grid>
  );
};
