import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import {
  Alert,
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { percent } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  insertAnswers,
  insertAnswerSet,
  insertAnswerTranslations,
} from "src/api/answer";
import {
  insertQuestion,
  insertQuestionAnswer,
  insertQuestionTheme,
  insertQuestionTranslations,
} from "src/api/question";
import { useUser } from "src/context/UserProvider";
import { ProposeQuestionForm } from "src/form/ProposeQuestionForm";
import { QuestionInsert } from "src/models/Question";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { RuleBlock } from "../RuleBlock";
import {
  CsvTemplateProposeQuestion,
  ExportCsvProposeQuestion,
} from "../file/ExportCsvProposeQuestion";
import { UploadButton } from "../file/ImportCsv";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

interface Props {
  open: boolean;
  close: () => void;
  theme: Theme;
}

enum Mode {
  FILE = "FILE",
  FORM = "FORM",
  LOADING = "LOADING",
}

export const ProposeQuestionModal = ({ theme, open, close }: Props) => {
  const { t } = useTranslation();
  const { language, uuid } = useUser();
  const themeMui = useTheme();
  const fullScreen = useMediaQuery(themeMui.breakpoints.down("md"));

  const [mode, setMode] = useState(Mode.FORM);

  const [numberQuestions, setNumberQuestions] = useState(1);
  const [numberQuestionsSave, setNumberQuestionsSave] = useState(0);
  const [numberQuestionsError, setNumberQuestionsError] = useState(0);

  useEffect(() => {
    setMode(Mode.FORM);
  }, [open]);

  const getFile = (file: File) => {
    setMode(Mode.LOADING);
    setNumberQuestionsSave(0);
    const reader = new FileReader();
    const csvString = CsvTemplateProposeQuestion(t);
    const linesTemplate = csvString.split(/\r\n|\n/);

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r\n|\n/);
      const questions = [...lines].filter(
        (line, index) =>
          !(index < 2 && line === linesTemplate[index]) && line !== ""
      );

      setNumberQuestions(questions.length);

      questions.forEach((line) => {
        saveQuestion(line);
      });
    };

    reader.onerror = () => {
      console.error("Erreur de lecture du fichier.");
    };

    reader.readAsText(file);
  };

  const saveQuestion = async (line: string) => {
    try {
      if (!language) throw new Error("no language");
      const data = line.split(";");
      const difficulty = "FACILE";
      const question = data[0];
      const response = data[1];
      const wrongresponse1 = data[2];
      const wrongresponse2 = data[3];
      const wrongresponse3 = data[4];
      const resAnswerSet = await insertAnswerSet({ name: null });
      if (resAnswerSet.error) throw resAnswerSet.error;

      const resAnswers = await insertAnswers([
        {
          answerset: resAnswerSet.data.id,
        },
        {
          answerset: resAnswerSet.data.id,
        },
        {
          answerset: resAnswerSet.data.id,
        },
        {
          answerset: resAnswerSet.data.id,
        },
      ]);
      if (resAnswers.error) throw resAnswers.error;

      const translations = [
        {
          answer: resAnswers.data[0].id,
          label: response,
          language: language.id,
          otherlabel: [],
        },
        {
          answer: resAnswers.data[1].id,
          label: wrongresponse1,
          language: language.id,
          otherlabel: [],
        },
        {
          answer: resAnswers.data[2].id,
          label: wrongresponse2,
          language: language.id,
          otherlabel: [],
        },
        {
          answer: resAnswers.data[3].id,
          label: wrongresponse3,
          language: language.id,
          otherlabel: [],
        },
      ];
      const resAnswerTranslation = await insertAnswerTranslations(translations);
      if (resAnswerTranslation.error) throw resAnswerTranslation.error;

      const newQuestion: QuestionInsert = {
        question: { "fr-FR": question },
        response: [{ "fr-FR": response }],
        difficulty: difficulty,
        isqcm: true,
        typequestion: "QCM",
        validate: false,
        responses: [
          { "fr-FR": wrongresponse1 },
          { "fr-FR": wrongresponse2 },
          { "fr-FR": wrongresponse3 },
        ],
        image: null,
        typeResponse: null,
        allresponse: false,
        exact: false,
        proposeby: uuid,
      };
      const resQuestion = await insertQuestion(newQuestion);
      if (resQuestion.error) throw resQuestion.error;

      const resQuestionTheme = await insertQuestionTheme({
        question: resQuestion.data.id,
        theme: theme.id,
      });
      if (resQuestionTheme.error) throw resQuestion.error;
      const resQuestionAnswer = await insertQuestionAnswer({
        question: resQuestion.data.id,
        answer: resAnswers.data[0].id,
      });
      if (resQuestionAnswer.error) throw resQuestionAnswer.error;

      const resQuestionTranslation = await insertQuestionTranslations([
        {
          question: resQuestion.data.id,
          label: question,
          language: language.id,
        },
      ]);
      if (resQuestionTranslation.error) throw resQuestionTranslation.error;
      setNumberQuestionsSave((prev) => prev + 1);
    } catch (err) {
      setNumberQuestionsError((prev) => prev + 1);
    }
  };

  const progress = useMemo(
    () =>
      ((numberQuestionsSave + numberQuestionsError) / numberQuestions) * 100,
    [numberQuestionsSave, numberQuestionsError, numberQuestions]
  );

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
          <>
            {
              {
                FORM: (
                  <>
                    <Grid item xs={12}>
                      <ButtonColor
                        value={Colors.blue}
                        label={t("commun.viaexcel")}
                        icon={AttachFileIcon}
                        variant="contained"
                        onClick={() => setMode(Mode.FILE)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider>
                        <Typography
                          variant="h4"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {t("commun.or")}
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <ProposeQuestionForm validate={close} theme={theme} />
                    </Grid>
                  </>
                ),
                FILE: (
                  <>
                    <Grid item xs={12}>
                      <ButtonColor
                        value={Colors.blue}
                        label={t("commun.viaform")}
                        icon={DynamicFormIcon}
                        variant="contained"
                        onClick={() => setMode(Mode.FORM)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ borderBottomWidth: 5 }}>
                        <Typography
                          variant="h4"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {t("commun.or")}
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <RuleBlock
                        rules={[
                          {
                            label: t("proposequestion.excel.step1"),
                            extra: (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <ExportCsvProposeQuestion />
                              </Box>
                            ),
                          },
                          { label: t("proposequestion.excel.step2") },
                          {
                            label: t("proposequestion.excel.step3"),
                            extra: (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <UploadButton getFile={getFile} />
                              </Box>
                            ),
                          },
                        ]}
                      />
                    </Grid>
                  </>
                ),
                LOADING: (
                  <>
                    {progress === 100 ? (
                      <>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Alert severity="success">
                            <Typography variant="h4">
                              {t("commun.propositionvalidate")}
                            </Typography>
                          </Alert>
                        </Grid>
                        <Grid item xs={12}>
                          <ButtonColor
                            value={Colors.blue}
                            label={t("commun.return")}
                            icon={KeyboardReturnIcon}
                            variant="contained"
                            onClick={close}
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h4">
                            {t("commun.inprogress")}
                          </Typography>
                        </Grid>
                        {numberQuestions > 1 && (
                          <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant="h6">
                              {numberQuestionsSave} / {numberQuestions}{" "}
                              {t("commun.questions")}
                            </Typography>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Box sx={{ width: percent(100) }}>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                            />
                          </Box>
                        </Grid>
                      </>
                    )}
                  </>
                ),
              }[mode]
            }
          </>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
