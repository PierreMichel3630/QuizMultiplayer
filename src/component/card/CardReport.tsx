import { Divider, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import {
  JsonLanguageArrayOrStringBlock,
  JsonLanguageBlock,
} from "../JsonLanguageBlock";

import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { Report } from "src/models/Report";
import { Colors } from "src/style/Colors";
import { ImageQuestionBlock } from "../ImageBlock";
import { Link } from "react-router-dom";

interface Props {
  report: Report;
  onDelete: () => void;
}

export const CardReport = ({ report, onDelete }: Props) => {
  const { t } = useTranslation();
  const question = report.question;

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
          <Typography variant="h2">{`${t("commun.report")} ${
            report.id
          }`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{`${t("commun.typeproblem")} :`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <JsonLanguageBlock value={report.message.message} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{`${t(
            "commun.descriptionerror"
          )} :`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{report.description}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {question && (
          <>
            <Grid item xs={12}>
              <Link to={`/administration/question/${question.id}`}>
                <Typography variant="h6">{`${t("commun.question")} ${
                  question.id
                }`}</Typography>
              </Link>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <JsonLanguageBlock
                sx={{ fontSize: 18 }}
                value={question.question}
              />
            </Grid>
            {question.image && (
              <Grid
                item
                xs={12}
                sx={{ height: px(100), backgroundColor: Colors.black }}
              >
                <ImageQuestionBlock src={question.image} />
              </Grid>
            )}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <JsonLanguageArrayOrStringBlock
                all={question.allresponse}
                value={question.response}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};
