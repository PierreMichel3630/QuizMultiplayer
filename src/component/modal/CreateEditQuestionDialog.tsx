import {
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { QuestionForm } from "src/form/QuestionForm";
import { QuestionAdmin } from "src/models/Question";
import { Theme } from "src/models/Theme";
import CloseIcon from "@mui/icons-material/Close";

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
    <Dialog onClose={close} open={open} fullWidth fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {question ? t("commun.editquestion") : t("commun.addquestion")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <QuestionForm theme={theme} validate={close} question={question} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
