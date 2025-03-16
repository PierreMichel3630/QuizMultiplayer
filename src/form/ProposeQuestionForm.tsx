import DoneIcon from "@mui/icons-material/Done";
import {
  FilledInput,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { insertQuestion, insertQuestionTheme } from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { SelectDifficulty } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { Difficulty } from "src/models/enum/DifficultyEnum";
import { QuestionInsert } from "src/models/Question";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  theme: Theme;
  validate: () => void;
}

export const ProposeQuestionForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    difficulty: string;
    question: string;
    theme: Theme;
    response: string;
    wrongresponse1: string;
    wrongresponse2: string;
    wrongresponse3: string;
  } = {
    question: "",
    response: "",
    wrongresponse1: "",
    wrongresponse2: "",
    wrongresponse3: "",
    difficulty: "FACILE",
    theme: theme,
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
        const newQuestion: QuestionInsert = {
          question: { "fr-FR": values.question },
          response: { "fr-FR": values.response },
          difficulty: values.difficulty,
          isqcm: true,
          typequestion: "QCM",
          validate: false,
          responses: [
            { "fr-FR": values.wrongresponse1 },
            { "fr-FR": values.wrongresponse2 },
            { "fr-FR": values.wrongresponse3 },
          ],
          image: null,
          typeResponse: null,
          allresponse: false,
          exact: false,
        };
        insertQuestion(newQuestion).then(async ({ error, data }) => {
          if (error) {
            setSeverity("error");
            setMessage(t("commun.error"));
          } else {
            const insertTheme = {
              question: data.id,
              theme: values.theme.id,
            };
            await insertQuestionTheme(insertTheme);
            setSeverity("success");
            setMessage(t("alert.addquestionpropose"));
            validate();
          }
        });
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
        <Grid item xs={12}>
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
