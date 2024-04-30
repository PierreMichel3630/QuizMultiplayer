import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Question, QuestionAdmin, QuestionUpdate } from "src/models/Question";
import { Difficulty } from "src/models/enum";
import { ImageQuestionBlock } from "../ImageBlock";
import {
  JsonLanguageArrayOrStringBlock,
  JsonLanguageBlock,
} from "../JsonLanguageBlock";
import { SelectDifficulty } from "../Select";

import DeleteIcon from "@mui/icons-material/Delete";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useTranslation } from "react-i18next";

import EditIcon from "@mui/icons-material/Edit";

interface Props {
  question: QuestionAdmin;
  onChange: (value: QuestionUpdate) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CardAdminQuestion = ({
  question,
  onChange,
  onDelete,
  onEdit,
}: Props) => {
  const { t } = useTranslation();

  const onChangeDifficulty = (value: Difficulty) => {
    const newQuestion: QuestionUpdate = {
      id: question.id,
      difficulty: value,
    };
    onChange(newQuestion);
  };

  return (
    <Paper
      sx={{
        p: 1,
        height: percent(100),
        position: "relative",
        backgroundColor: Colors.black,
        color: Colors.white,
      }}
      variant="outlined"
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{`${t("commun.question")} ${
            question.id
          }`}</Typography>
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
        <Grid item xs={6}>
          <ButtonColor
            value={Colors.red}
            label={t("commun.delete")}
            icon={DeleteIcon}
            variant="contained"
            onClick={onDelete}
          />
        </Grid>
        <Grid item xs={6}>
          <ButtonColor
            value={Colors.purple}
            label={t("commun.edit")}
            icon={EditIcon}
            variant="contained"
            onClick={onEdit}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

interface PropsCardSignalQuestion {
  question: Question;
  report?: () => void;
}
export const CardSignalQuestion = ({
  question,
  report,
}: PropsCardSignalQuestion) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 1, height: percent(100), position: "relative" }}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <JsonLanguageBlock
            variant="h2"
            color="text.secondary"
            value={question.question}
          />
        </Grid>
        {question.image && (
          <Grid item xs={12} sx={{ height: px(200) }}>
            <ImageQuestionBlock src={question.image} />
          </Grid>
        )}
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <JsonLanguageArrayOrStringBlock
            variant="h4"
            color="text.secondary"
            all={question.allresponse}
            value={question.response}
          />
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
