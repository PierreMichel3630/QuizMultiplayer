import {
  Dialog,
  DialogContent,
  Grid,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ValidateProposeQuestionForm } from "src/form/ValidateProposeQuestionForm";
import { QuestionAdmin } from "src/models/Question";

import { TitleModal } from "./commun/TitleModal";

interface PropsValidationProposeQuestion {
  question: QuestionAdmin;
  open: boolean;
  close: () => void;
}

export const ValidationProposeQuestion = ({
  question,
  open,
  close,
}: PropsValidationProposeQuestion) => {
  const { t } = useTranslation();
  const themeMui = useTheme();
  const fullScreen = useMediaQuery(themeMui.breakpoints.down("md"));

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
    >
      <TitleModal title={t("commun.proposequestion")} close={close} />
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <ValidateProposeQuestionForm validate={close} question={question} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
