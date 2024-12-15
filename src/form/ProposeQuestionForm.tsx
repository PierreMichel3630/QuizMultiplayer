import DoneIcon from "@mui/icons-material/Done";
import {
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
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
  const [wrongresponse, setWrongresponse] = useState("");

  const initialValue: {
    difficulty: string;
    question: string;
    theme: Theme;
    response: string;
    wrongresponses: Array<string>;
  } = {
    question: "",
    response: "",
    wrongresponses: [],
    difficulty: "FACILE",
    theme: theme,
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required(t("form.proposequestion.requiredquestion")),
    response: Yup.string().required(t("form.proposequestion.requiredresponse")),
    difficulty: Yup.string(),
    theme: Yup.mixed(),
    wrongresponses: Yup.array()
      .of(Yup.string())
      .min(1, t("form.proposequestion.requiredminwrongresponses"))
      .max(5, t("form.proposequestion.requiredmaxwrongresponses"))
      .test(
        "responsevalid",
        t("form.proposequestion.formatwrongresponses"),
        (value) =>
          value
            ? value.filter((el) => el === "" || el === undefined).length === 0
            : false
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
          responses: values.wrongresponses.map((el) => ({
            "fr-FR": el,
          })),
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
          >
            <InputLabel htmlFor="input-question">
              {t("form.proposequestion.question")}
            </InputLabel>
            <OutlinedInput
              id="input-question"
              value={formik.values.question}
              name="question"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.proposequestion.question")}
              placeholder={t("form.proposequestion.placehoderquestion")}
              multiline
              maxRows={4}
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
          >
            <InputLabel htmlFor="input-response">
              {t("form.proposequestion.response")}
            </InputLabel>
            <OutlinedInput
              id="input-response"
              value={formik.values.response}
              name="response"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.proposequestion.response")}
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
        <Grid item xs={8}>
          <TextField
            value={wrongresponse}
            onChange={(event) => setWrongresponse(event.target.value)}
            label={t("form.proposequestion.wrongresponse")}
            placeholder={t("form.proposequestion.placehoderwrongresponse")}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={4}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.add")}
            variant="contained"
            onClick={() => {
              formik.setFieldValue("wrongresponses", [
                ...formik.values.wrongresponses,
                wrongresponse,
              ]);
              setWrongresponse("");
            }}
          />
        </Grid>

        {formik.values.wrongresponses.map((wrongresponse, i) => (
          <Grid item key={i}>
            <Chip
              label={wrongresponse}
              onDelete={() => {
                const newResponses = [...formik.values.wrongresponses];
                newResponses.splice(i, 1);
                formik.setFieldValue(`wrongresponses`, newResponses);
              }}
            />
          </Grid>
        ))}
        {formik.errors.wrongresponses && formik.touched.wrongresponses && (
          <Grid item xs={12}>
            <FormHelperText error id={`error-wrongresponses`}>
              {formik.errors.wrongresponses}
            </FormHelperText>
          </Grid>
        )}
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
