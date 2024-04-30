import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { QuestionForm } from "src/form/QuestionForm";
import { QuestionAdmin } from "src/models/Question";
import { Theme } from "src/models/Theme";

interface Props {
  question?: QuestionAdmin;
  theme?: Theme;
  open: boolean;
  close: () => void;
}

export const CreateEditQuestionDialog = ({
  question,
  theme,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">
              {question ? t("commun.editquestion") : t("commun.addquestion")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <QuestionForm theme={theme} validate={close} question={question} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
