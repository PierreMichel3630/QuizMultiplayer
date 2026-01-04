import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { QuestionCount } from "src/models/Question";
import { LanguageIcon } from "./LanguageBlock";
import { Trans, useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { px } from "csx";

interface PropsQuestionLanguageModal {
  values: Array<QuestionCount>;
  open: boolean;
  onClose: () => void;
}

export const QuestionLanguageModal = ({
  values,
  open,
  onClose,
}: PropsQuestionLanguageModal) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ position: "absolute", top: px(2), right: px(2) }}>
        <IconButton aria-label="close" size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={1}>
          {values.map((value, index) => (
            <Grid
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
              size={12}>
              <LanguageIcon language={value.language} size={40} />
              <Typography variant="h4">
                <Trans
                  i18nKey={t("commun.question")}
                  values={{
                    count: value.questions,
                  }}
                />
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
