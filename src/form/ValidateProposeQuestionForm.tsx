import DoneIcon from "@mui/icons-material/Done";
import {
  Divider,
  FilledInput,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  deleteQuestionById,
  deleteQuestionThemeById,
  insertQuestionTheme,
  selectQuestionThemeByQuestion,
  updateQuestion,
} from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { SelectDifficulty } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { Difficulty } from "src/models/enum/DifficultyEnum";
import { QuestionPropose, QuestionUpdate } from "src/models/Question";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useCallback, useEffect } from "react";
import { AutocompleteInputTheme } from "src/component/Autocomplete";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { QuestionTheme, Theme } from "src/models/Theme";

interface Props {
  question: QuestionPropose;
  validate: () => void;
}

export const ValidateProposeQuestionForm = ({ validate, question }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const [questionThemes, setQuestionThemes] = useState<Array<QuestionTheme>>(
    []
  );

  const initialValue: {
    difficulty: string;
    question: string;
    response: string;
    wrongresponse1: string;
    wrongresponse2: string;
    wrongresponse3: string;
  } = {
    question: question.question["fr-FR"],
    response: question.response["fr-FR"],
    wrongresponse1: question.responses[0]["fr-FR"],
    wrongresponse2: question.responses[1]["fr-FR"],
    wrongresponse3: question.responses[2]["fr-FR"],
    difficulty: question.difficulty,
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required(t("form.proposequestion.requiredquestion")),
    response: Yup.string().required(t("form.proposequestion.requiredresponse")),
    difficulty: Yup.string(),
    theme: Yup.mixed(),
    wrongresponse1: Yup.string().required(
      t("form.proposequestion.requiredwrongresponses")
    ),
    wrongresponse2: Yup.string().required(
      t("form.proposequestion.requiredwrongresponses")
    ),
    wrongresponse3: Yup.string().required(
      t("form.proposequestion.requiredwrongresponses")
    ),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newQuestion: QuestionUpdate = {
          id: question.id,
          question: { "fr-FR": values.question },
          response: { "fr-FR": values.response },
          difficulty: values.difficulty,
          isqcm: true,
          typequestion: "QCM",
          validate: true,
          responses: [
            { "fr-FR": values.wrongresponse1 },
            { "fr-FR": values.wrongresponse2 },
            { "fr-FR": values.wrongresponse3 },
          ],
        };
        updateQuestion(newQuestion).then(({ error }) => {
          if (error) {
            setSeverity("error");
            setMessage(t("commun.error"));
          } else {
            validate();
          }
        });
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  const getThemes = useCallback(() => {
    selectQuestionThemeByQuestion(Number(question.id)).then(({ data }) => {
      setQuestionThemes(data as Array<QuestionTheme>);
    });
  }, [question]);

  useEffect(() => {
    getThemes();
  }, [getThemes]);

  const deleteTheme = (id: number) => {
    deleteQuestionThemeById(id).then(() => {
      getThemes();
    });
  };

  const insertTheme = (theme: Theme) => {
    if (question) {
      const value = { theme: theme.id, question: question.id };
      insertQuestionTheme(value).then(() => {
        getThemes();
      });
    }
  };

  const deleteProposition = () => {
    deleteQuestionById(question.id).then(({ error }) => {
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        validate();
      }
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.difficulty && formik.errors.difficulty
            )}
          >
            <SelectDifficulty
              value={formik.values.difficulty as Difficulty}
              onSelect={(value) => formik.setFieldValue("difficulty", value)}
            />
            <FormHelperText error id={`error-difficulty`}>
              {formik.errors.difficulty}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.question && formik.errors.question)}
            variant="filled"
          >
            <InputLabel shrink htmlFor="input-question">
              {t("form.proposequestion.question")}
            </InputLabel>
            <FilledInput
              id="input-question"
              value={formik.values.question}
              name="question"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={t("form.proposequestion.placehoderquestion")}
              multiline
              maxRows={3}
              inputProps={{}}
            />
            {formik.touched.question && formik.errors.question && (
              <FormHelperText error id="error-question">
                {formik.errors.question}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.response && formik.errors.response)}
            variant="filled"
          >
            <InputLabel shrink htmlFor="input-response">
              {t("form.proposequestion.response")}
            </InputLabel>
            <FilledInput
              id="input-response"
              value={formik.values.response}
              name="response"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={t("form.proposequestion.placehoderresponse")}
              inputProps={{}}
            />
            {formik.touched.response && formik.errors.response && (
              <FormHelperText error id="error-response">
                {formik.errors.response}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.wrongresponse1 && formik.errors.wrongresponse1
            )}
            variant="filled"
          >
            <InputLabel shrink htmlFor="input-wrongresponse1">
              {t("form.proposequestion.wrongresponse1")}
            </InputLabel>
            <FilledInput
              id="input-wrongresponse1"
              value={formik.values.wrongresponse1}
              name="wrongresponse1"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={t("form.proposequestion.placeholderwrongresponse1")}
              inputProps={{}}
            />
            {formik.touched.wrongresponse1 && formik.errors.wrongresponse1 && (
              <FormHelperText error id="error-wrongresponse1">
                {formik.errors.wrongresponse1}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.wrongresponse2 && formik.errors.wrongresponse2
            )}
            variant="filled"
          >
            <InputLabel shrink htmlFor="input-wrongresponse2">
              {t("form.proposequestion.wrongresponse2")}
            </InputLabel>
            <FilledInput
              id="input-wrongresponse2"
              value={formik.values.wrongresponse2}
              name="wrongresponse2"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={t("form.proposequestion.placeholderwrongresponse2")}
              inputProps={{}}
            />
            {formik.touched.wrongresponse2 && formik.errors.wrongresponse2 && (
              <FormHelperText error id="error-wrongresponse2">
                {formik.errors.wrongresponse2}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.wrongresponse3 && formik.errors.wrongresponse3
            )}
            variant="filled"
          >
            <InputLabel shrink htmlFor="input-wrongresponse3">
              {t("form.proposequestion.wrongresponse3")}
            </InputLabel>
            <FilledInput
              id="input-wrongresponse3"
              value={formik.values.wrongresponse3}
              name="wrongresponse3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={t("form.proposequestion.placeholderwrongresponse3")}
              inputProps={{}}
            />
            {formik.touched.wrongresponse3 && formik.errors.wrongresponse3 && (
              <FormHelperText error id="error-wrongresponse3">
                {formik.errors.wrongresponse3}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
            {t("commun.themes")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AutocompleteInputTheme
            placeholder={t("commun.selecttheme")}
            onSelect={(newvalue) => insertTheme(newvalue)}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {questionThemes.map((el) => (
              <Grid item xs={12} key={el.id}>
                <Paper sx={{ p: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <ImageThemeBlock theme={el.theme} size={50} />
                    </Grid>
                    <Grid item xs>
                      <JsonLanguageBlock value={el.theme.name} />
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => deleteTheme(el.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <ButtonColor
            value={Colors.red}
            label={t("commun.delete")}
            endIcon={<DeleteIcon />}
            variant="contained"
            onClick={() => deleteProposition()}
          />
        </Grid>
        <Grid item xs={6}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.validate")}
            endIcon={<DoneIcon />}
            variant="contained"
            type="submit"
          />
        </Grid>
      </Grid>
    </form>
  );
};
