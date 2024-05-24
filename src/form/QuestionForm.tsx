import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  insertQuestion,
  insertQuestionTheme,
  updateQuestion,
} from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { InputEnter } from "src/component/Input";
import { SelectDifficulty, SelectIso } from "src/component/Select";
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
    languages: Array<{
      question: string;
      response: Array<string> | string;
      language: string;
    }>;
  } = {
    languages: question
      ? Object.keys(question.question).map((el) => ({
          question: question.question[el],
          response: question.response[el],
          language: el,
        }))
      : [],
    difficulty: question ? question.difficulty : "FACILE",
    typeResponse: question ? question.typeResponse : "",
    image: question && question.image ? question.image : null,
    theme: question ? question.theme : theme ? theme : null,
  };

  const validationSchema = Yup.object().shape({
    typeResponse: Yup.string().required(
      t("form.createquestion.requiredtyperesponse")
    ),
    language: Yup.array().of(
      Yup.object({
        question: Yup.string().required(
          t("form.createquestion.requiredtyperesponse")
        ),
        response: Yup.string().required(
          t("form.createquestion.requiredtyperesponse")
        ),
        language: Yup.string().required(
          t("form.createquestion.requiredtyperesponse")
        ),
      })
    ),
    difficulty: Yup.string(),
    image: Yup.mixed().nullable(),
    theme: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const questionLanguage = values.languages.reduce(
          (acc, value) => ({ ...acc, [value.language]: value.question }),
          {}
        );
        const responseLanguage = values.languages.reduce(
          (acc, value) => ({ ...acc, [value.language]: value.response }),
          {}
        );
        const newQuestion = {
          question: questionLanguage,
          response: responseLanguage,
          image: values.image,
          difficulty: values.difficulty,
          typeResponse: values.typeResponse,
        };
        const { error, data } = question
          ? await updateQuestion({ id: question.id, ...newQuestion })
          : await insertQuestion(newQuestion);
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
          <Divider>
            <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
              {t("commun.questions")}
            </Typography>
          </Divider>
        </Grid>
        {formik.values.languages.map((language, index) => {
          const responses =
            typeof language.response === "string"
              ? language.response !== ""
                ? [language.response]
                : []
              : language.response;
          const touched =
            formik.touched &&
            formik.touched.languages &&
            formik.touched.languages[index]
              ? (formik.touched.languages![index] as {
                  language?: boolean;
                  question?: boolean;
                  response?: boolean;
                })
              : {};
          const errors =
            formik.errors &&
            formik.errors.languages &&
            formik.errors.languages[index]
              ? (formik.errors.languages![index] as {
                  language?: string;
                  question?: string;
                  response?: string;
                })
              : {
                  language: undefined,
                  question: undefined,
                  response: undefined,
                };
          return (
            <Grid item xs={12} key={index}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.language && errors.language)}
                  >
                    <SelectIso
                      value={language.language}
                      onChange={(value) =>
                        formik.setFieldValue(
                          `languages[${index}].language`,
                          value
                        )
                      }
                    />
                    {touched.language && errors.language && (
                      <FormHelperText error id="error-language">
                        {errors.language}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.question && errors.question)}
                  >
                    <InputLabel htmlFor="question-input">
                      {t("form.createquestion.question")}
                    </InputLabel>
                    <OutlinedInput
                      id="question-input"
                      type="text"
                      value={language.question}
                      onChange={(event) => {
                        formik.setFieldValue(
                          `languages[${index}].question`,
                          event.target.value
                        );
                      }}
                      onBlur={() =>
                        formik.setFieldTouched(`languages[${index}].question`)
                      }
                      label={t("form.createquestion.question")}
                      inputProps={{}}
                    />
                    {touched.question && errors.question && (
                      <FormHelperText error id="error-question">
                        {errors.question}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputEnter
                    onChange={(value) =>
                      formik.setFieldValue(`languages[${index}].response`, [
                        ...responses,
                        value,
                      ])
                    }
                    label={t("form.createquestion.response")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {responses.map((response, i) => (
                      <Chip
                        key={i}
                        label={response}
                        onDelete={() =>
                          formik.setFieldValue(
                            `languages[${index}].response`,
                            responses.filter((r) => r !== response)
                          )
                        }
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <ButtonColor
                    value={Colors.red}
                    label={t("commun.removelanguage")}
                    icon={DeleteIcon}
                    variant="contained"
                    onClick={() => {
                      const newValue = [...formik.values.languages];
                      newValue.splice(index, 1);
                      formik.setFieldValue("languages", newValue);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          );
        })}
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.purple}
            label={t("commun.addlanguage")}
            icon={AddCircleIcon}
            variant="contained"
            onClick={() => {
              formik.setFieldValue("languages", [
                ...formik.values.languages,
                { language: "", question: "", response: "" },
              ]);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.add")}
            icon={AddCircleIcon}
            variant="contained"
            type="submit"
          />
        </Grid>
      </Grid>
    </form>
  );
};
