import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { px } from "csx";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { ImageQuestionBlock } from "src/component/ImageBlock";
import { SelectLanguage } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import {
  QuestionAdmin,
  QuestionTranslationInsert,
  QuestionTranslationUpdate,
} from "src/models/Question";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteQuestionTranslationByIds,
  insertQuestionTranslations,
  updateQuestion,
  updateQuestionTranslation,
} from "src/api/question";

interface Props {
  question: QuestionAdmin;
  validate: () => void;
}

export const QuestionForm = ({ question, validate }: Props) => {
  const { t } = useTranslation();
  const { language, languages } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    image: undefined | string;
    questiontranslation: Array<{
      id?: number;
      label: string;
      language: Language;
    }>;
  } = {
    image: question?.image ? question.image : undefined,
    questiontranslation: question
      ? question.questiontranslation
      : [
          {
            label: "",
            language: language!,
          },
        ],
  };

  const validationSchema = Yup.object().shape({
    image: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await updateQuestion({
          id: question.id,
          image: values.image,
        });

        // TRANSLATIONS
        const previousTranslations = question
          ? [...question.questiontranslation]
          : [];
        const newTranslations = [...values.questiontranslation];
        const translationsToAdd: Array<QuestionTranslationInsert> = [
          ...newTranslations,
        ]
          .filter((el) => el.id === undefined)
          .map((el) => ({
            question: question.id,
            label: el.label,
            language: el.language.id,
          }));
        const translationsToModify = [...newTranslations]
          .filter((el) => {
            const isExist = [...previousTranslations].find(
              (previous) => previous.id === el.id
            );
            return isExist;
          })
          .filter((el) => el.id !== undefined)
          .map(
            (el) =>
              ({
                id: el.id,
                question: question.id,
                label: el.label,
                language: el.language.id,
              } as QuestionTranslationUpdate)
          );
        const translationsToDelete = [...previousTranslations]
          .filter((el) => {
            const isExist = [...newTranslations].find(
              (previous) => previous.id === el.id
            );
            return !isExist;
          })
          .map((el) => el.id) as Array<number>;
        if (translationsToAdd.length > 0) {
          await insertQuestionTranslations(translationsToAdd);
        }
        if (translationsToModify.length > 0) {
          await updateQuestionTranslation(translationsToModify);
        }
        if (translationsToDelete.length > 0) {
          await deleteQuestionTranslationByIds(translationsToDelete);
        }
        validate();
      } catch (err) {
        console.error(err);
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={12}>
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
            <Grid sx={{ height: px(200) }} size={12}>
              <ImageQuestionBlock src={formik.values.image} />
            </Grid>
          )}
          <Grid size={12}>
            <Divider sx={{ borderBottomWidth: 5 }} />
          </Grid>

          <Grid size={12}>
            <FieldArray name="questiontranslation">
              {({ push, remove }) => {
                const idLanguageUsed = [
                  ...formik.values.questiontranslation,
                ].map((el) => el.language.id);
                const languageNotUsed = [...languages].filter(
                  (lang) => !idLanguageUsed.includes(lang.id)
                );
                return (
                  <>
                    {[...formik.values.questiontranslation].map((_, index) => {
                      const value = formik.values.questiontranslation[index];
                      return (
                        <Grid
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          size={12}>
                          <SelectLanguage
                            value={value.language}
                            languages={languageNotUsed}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `questiontranslation.${index}.language`,
                                value
                              )
                            }
                          />
                          <TextField
                            name={`questiontranslation.${index}.label`}
                            value={value.label}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            size="small"
                            fullWidth
                          />
                          <IconButton
                            aria-label="delete"
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon fontSize="large" />
                          </IconButton>
                        </Grid>
                      );
                    })}
                    {languageNotUsed.length > 0 && (
                      <Grid size={12}>
                        <ButtonColor
                          value={Colors.blue}
                          label={t("commun.addtranslation")}
                          icon={AddCircleIcon}
                          variant="contained"
                          onClick={() =>
                            push({
                              label: "",
                              otherlabel: [],
                              language: languageNotUsed[0],
                            })
                          }
                        />
                      </Grid>
                    )}
                  </>
                );
              }}
            </FieldArray>
          </Grid>

          <Grid size={12}>
            <ButtonColor
              value={Colors.green}
              label={t("commun.validate")}
              variant="contained"
              type="submit"
            />
          </Grid>
        </Grid>
      </form>
    </FormikProvider>
  );
};
