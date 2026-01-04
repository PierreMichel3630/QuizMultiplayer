import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { selectQuestionById } from "src/api/question";
import { QuestionForm } from "src/form/QuestionForm";
import { QuestionAdmin } from "src/models/Question";

export default function AdminQuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );

  const getQuestion = useCallback(() => {
    if (id) {
      selectQuestionById(Number(id)).then(({ data }) => {
        setQuestion(data as QuestionAdmin);
      });
    }
  }, [id]);

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <Grid container spacing={1} justifyContent="center" sx={{ mt: 2, mb: 2 }}>
      {question && (
        <Grid item xs={12}>
          <QuestionForm validate={close} question={question} />
        </Grid>
      )}
    </Grid>
  );
}
