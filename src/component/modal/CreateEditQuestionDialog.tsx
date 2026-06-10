import {
  Dialog,
  DialogContent,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { QuestionForm } from "src/form/QuestionForm";
import { QuestionAdmin } from "src/models/Question";
import { TitleModal } from "./commun/TitleModal";

interface Props {
  question?: QuestionAdmin;
  open: boolean;
  close: () => void;
}

export const CreateEditQuestionDialog = ({ question, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open} maxWidth="md" fullWidth>
      <TitleModal
        title={question ? t("commun.editquestion") : t("commun.addquestion")}
        close={close}
      />
      <DialogContent>
        <Grid container spacing={2}>
          {question && (
            <Grid size={12}>
              <QuestionForm validate={close} question={question} />
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
