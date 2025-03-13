import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectQuestionsPropose } from "src/api/question";
import { QuestionPropose } from "src/models/Question";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { ValidateProposeQuestionForm } from "src/form/ValidateProposeQuestionForm";

export const AdminQuestionProposeBlock = () => {
  const { t } = useTranslation();

  const [questions, setQuestions] = useState<Array<QuestionPropose>>([]);
  const [openModal, setOpenModal] = useState(false);
  const [question, setQuestion] = useState<QuestionPropose | undefined>(
    undefined
  );

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
        <Grid item xs={12} sm={6} key={question.id}>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <Typography variant="h4">
              {t("commun.proposition", { count: index + 1 })}
            </Typography>
            <Box>
              <IconButton
                aria-label="edit"
                onClick={() => {
                  setQuestion(question);
                  setOpenModal(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      ))}
      {question && (
        <ValidationProposeQuestion
          open={openModal}
          question={question}
          close={() => {
            setOpenModal(false);
            getQuestionsPropose();
          }}
        />
      )}
    </Grid>
  );
};

interface PropsValidationProposeQuestion {
  question: QuestionPropose;
  open: boolean;
  close: () => void;
}

const ValidationProposeQuestion = ({
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
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.proposequestion")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ValidateProposeQuestionForm validate={close} question={question} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
