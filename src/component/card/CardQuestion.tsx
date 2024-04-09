import { Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { QuestionAdmin, QuestionUpdate } from "src/models/Question";
import { Difficulty } from "src/models/enum";
import { ImageQuestionBlock } from "../ImageBlock";
import {
  JsonLanguageArrayOrStringBlock,
  JsonLanguageBlock,
} from "../JsonLanguageBlock";
import { SelectDifficulty } from "../Select";

import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  question: QuestionAdmin;
  onChange: (value: QuestionUpdate) => void;
  onDelete: () => void;
}

export const CardAdminQuestion = ({ question, onChange, onDelete }: Props) => {
  const onChangeDifficulty = (value: Difficulty) => {
    const newQuestion: QuestionUpdate = {
      id: question.id,
      difficulty: value,
    };
    onChange(newQuestion);
  };

  return (
    <Paper
      sx={{ p: 1, height: percent(100), position: "relative" }}
      variant="outlined"
    >
      <DeleteIcon
        sx={{ cursor: "pointer", position: "absolute", top: 5, right: 5 }}
        onClick={onDelete}
      />
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{question.id}</Typography>
        </Grid>
        <Grid item>
          <SelectDifficulty
            value={question.difficulty as Difficulty}
            onSelect={onChangeDifficulty}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <JsonLanguageBlock sx={{ fontSize: 18 }} value={question.question} />
        </Grid>
        {question.image && (
          <Grid item xs={12} sx={{ height: px(200) }}>
            <ImageQuestionBlock src={question.image} />
          </Grid>
        )}
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <JsonLanguageArrayOrStringBlock
            all={question.allresponse}
            value={question.response}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
