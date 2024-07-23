import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  insertQuestionAdmin,
  insertQuestionTheme,
  updateQuestion,
} from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { InputEnter } from "src/component/Input";
import { SelectDifficulty } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { QuestionAdmin } from "src/models/Question";
import { Theme } from "src/models/Theme";
import { Difficulty } from "src/models/enum";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  question?: QuestionAdmin;
  theme?: Theme;
  validate: () => void;
}

export const QuestionForm = ({ question, validate, theme }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    difficulty: string;
    typeResponse: string;
    image: null | string;
    theme: null | Theme;
    question: string;
    responses: Array<string>;
  } = {
    question: question ? question.question["fr-FR"] : "",
    responses: question ? question.response["fr-FR"] : [],
    difficulty: question ? question.difficulty : "FACILE",
    typeResponse: question ? question.typeResponse : "",
    image: question && question.image ? question.image : null,
    theme: question ? question.theme : theme ? theme : null,
  };

  const validationSchema = Yup.object().shape({
    typeResponse: Yup.string().required(
      t("form.createquestion.requiredtyperesponse")
    ),
    question: Yup.string().required(
      t("form.createquestion.requiredquestionfr")
    ),
    responses: Yup.array()
      .of(Yup.string())
      .min(1, t("form.createquestion.requiredresponsefr")),
    difficulty: Yup.string(),
    image: Yup.mixed().nullable(),
    theme: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newQuestion = {
          question: question
            ? {
                ...question.question,
                "fr-FR": values.question,
              }
            : {
                "fr-FR": values.question,
              },
          response: question
            ? {
                ...question.response,
                "fr-FR": values.responses,
              }
            : {
                "fr-FR": values.responses,
              },
          image: values.image,
          difficulty: values.difficulty,
          typeResponse: values.typeResponse,
        };
        const { error, data } = question
          ? await updateQuestion({ id: question.id, ...newQuestion })
          : await insertQuestionAdmin(newQuestion);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          if (!question) {
            const insertTheme = {
              question: data.id,
              theme: values.theme ? values.theme.id : 1,
            };
            await insertQuestionTheme(insertTheme);
          }
          validate();
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

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
            error={Boolean(formik.touched.image && formik.errors.image)}
          >
            <InputLabel htmlFor="image-input">
              {t("form.createquestion.image")}
            </InputLabel>
            <OutlinedInput
              id="image-input"
              type="text"
              value={formik.values.image}
              name="image"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createquestion.image")}
              inputProps={{}}
            />
            {formik.touched.image && formik.errors.image && (
              <FormHelperText error id="error-image">
                {formik.errors.image}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.typeResponse && formik.errors.typeResponse
            )}
          >
            <InputLabel htmlFor="typeResponse-input">
              {t("form.createquestion.typeResponse")}
            </InputLabel>
            <OutlinedInput
              id="typeResponse-input"
              type="text"
              value={formik.values.typeResponse}
              name="typeResponse"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createquestion.typeResponse")}
              inputProps={{}}
            />
            {formik.touched.typeResponse && formik.errors.typeResponse && (
              <FormHelperText error id="error-typeResponse">
                {formik.errors.typeResponse}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.question && formik.errors.question)}
          >
            <InputLabel htmlFor="question-input">
              {t("form.createquestion.question")}
            </InputLabel>
            <OutlinedInput
              id="question-input"
              type="text"
              value={formik.values.question}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createquestion.question")}
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
          <InputEnter
            onChange={(value) =>
              formik.setFieldValue(`responses`, [
                ...formik.values.responses,
                value,
              ])
            }
            label={t("form.createquestion.response")}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {formik.values.responses.map((response, i) => (
              <Chip
                key={i}
                label={response}
                onDelete={() =>
                  formik.setFieldValue(
                    `responses`,
                    [...formik.values.responses].filter((r) => r !== response)
                  )
                }
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.validate")}
            variant="contained"
            type="submit"
          />
        </Grid>
      </Grid>
    </form>
  );
};
