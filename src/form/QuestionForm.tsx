import {
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from "@mui/material";
import { px } from "csx";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  insertQuestionAdmin,
  insertQuestionTheme,
  updateQuestion,
} from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { ImageQuestionBlock } from "src/component/ImageBlock";
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
    typeResponse: string | null;
    image: undefined | string;
    theme: undefined | Theme;
    question: string;
    response: Array<string>;
    typequestion: string;
    validate: boolean;
    exact: boolean;
    allresponse: boolean;
    responses: Array<string>;
    isqcm: boolean | null;
  } = {
    exact: question ? question.exact : false,
    allresponse: question ? question.allresponse : false,
    validate: question ? question.validate : false,
    question: question ? question.question["fr-FR"] : "",
    typequestion: question ? question.typequestion : "DEFAULT",
    response: question
      ? Array.isArray(question.response["fr-FR"])
        ? question.response["fr-FR"]
        : [question.response["fr-FR"]]
      : [],
    difficulty: question ? question.difficulty : "FACILE",
    typeResponse: question ? question.typeResponse : null,
    image: question && question.image ? question.image : undefined,
    theme:
      question && question.theme ? question.theme : theme ? theme : undefined,
    responses: question ? question.responses.map((el) => el["fr-FR"]) : [],
    isqcm: question ? question.isqcm : true,
  };

  const validationSchema = Yup.object().shape({
    typeResponse: Yup.string().nullable(),
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
                "fr-FR": values.response,
              }
            : {
                "fr-FR": values.response,
              },
          responses: values.responses.map((el) => ({ "fr-FR": el })),
          exact: values.exact,
          allresponse: values.allresponse,
          typequestion: values.typequestion,
          validate: values.validate,
          image: values.image ? values.image : null,
          difficulty: values.difficulty,
          typeResponse: values.typeResponse,
          isqcm: values.isqcm,
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
          setSeverity("success");
          setMessage(t("alert.updatequestion"));
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
          <FormControl fullWidth>
            <InputLabel id="select-typequestion-label">
              {t("form.createquestion.typequestion")}
            </InputLabel>
            <Select
              labelId="select-typequestion-label"
              id="select-typequestion"
              value={formik.values.typequestion}
              name="typequestion"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            >
              <MenuItem value="DEFAULT">DEFAULT</MenuItem>
              <MenuItem value="QCM">QCM</MenuItem>
              <MenuItem value="ORDER">ORDER</MenuItem>
              <MenuItem value="IMAGE">IMAGE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.validate}
                  onChange={formik.handleChange}
                  name="validate"
                />
              }
              label={t("form.createquestion.validate")}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.exact}
                  onChange={formik.handleChange}
                  name="exact"
                />
              }
              label={t("form.createquestion.exact")}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.allresponse}
                  onChange={formik.handleChange}
                  name="allresponse"
                />
              }
              label={t("form.createquestion.allresponse")}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel id="radio-isqcm-label" color="error">
              {t("form.createquestion.isqcm")}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="radio-isqcm-label"
              name="isqcm"
              value={formik.values.isqcm}
              onChange={formik.handleChange}
            >
              <FormControlLabel value={null} control={<Radio />} label="NULL" />
              <FormControlLabel value={true} control={<Radio />} label="TRUE" />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="FALSE"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
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
        {formik.values.image && formik.values.image !== "" && (
          <Grid item xs={12} sx={{ height: px(200) }}>
            <ImageQuestionBlock src={formik.values.image} />
          </Grid>
        )}
        {formik.values.typequestion !== "QCM" && (
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
        )}
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
              name="question"
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
              formik.setFieldValue(`response`, [
                ...formik.values.response,
                value,
              ])
            }
            label={t("form.createquestion.response")}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {formik.values.response.map((response, i) => (
              <Grid item key={i}>
                <Chip
                  label={response}
                  onDelete={() =>
                    formik.setFieldValue(
                      `response`,
                      [...formik.values.response].filter((r) => r !== response)
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {formik.values.typequestion === "QCM" && (
          <>
            <Grid item xs={12}>
              <InputEnter
                onChange={(value) =>
                  formik.setFieldValue(`responses`, [
                    ...formik.values.responses,
                    value,
                  ])
                }
                label={t("form.createquestion.responses")}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {formik.values.responses.map((response, i) => (
                  <Grid item key={i}>
                    <Chip
                      label={response}
                      onDelete={() =>
                        formik.setFieldValue(
                          `responses`,
                          [...formik.values.responses].filter(
                            (r) => r !== response
                          )
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </>
        )}
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
