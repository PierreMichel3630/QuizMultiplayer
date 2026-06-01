import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Chip,
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
import {
  deleteAnswerTranslationByIds,
  insertAnswers,
  insertAnswerTranslation,
  updateAnswer,
  updateAnswerTranslation,
} from "src/api/answer";
import { ButtonColor } from "src/component/Button";
import { ImageQCMBlock } from "src/component/ImageBlock";
import { SelectLanguage } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import {
  Answer,
  AnswerTranslationInsert,
  AnswerTranslationUpdate,
} from "src/models/Answer";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  answerset: number;
  answer?: Answer;
  validate: () => void;
}

export const AnswerForm = ({ validate, answer, answerset }: Props) => {
  const { t } = useTranslation();
  const { languages, language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    image?: string;
    answertranslation: Array<{
      id?: number;
      label: string;
      otherlabel: Array<string>;
      language: Language;
      tempOtherLabel?: string;
    }>;
  } = {
    image: answer ? answer.image : undefined,
    answertranslation: answer
      ? [...answer.answertranslation]
      : [
          {
            label: "",
            otherlabel: [],
            language: language!,
          },
        ],
  };

  const validationSchema = Yup.object().shape({});

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let idAnswer = answer ? answer.id : undefined;
        if (idAnswer === undefined) {
          const resAnswers = await insertAnswers([
            {
              image: values.image,
              answerset: answerset,
            },
          ]);
          if (resAnswers.error) throw resAnswers.error;
          idAnswer = resAnswers.data[0].id;
        } else {
          const resAnswers = await updateAnswer({
            id: idAnswer,
            image: values.image,
          });
          if (resAnswers.error) throw resAnswers.error;
        }
        if (idAnswer === undefined) throw "no answer";

        // TRANSLATIONS
        const previousTranslations = answer
          ? [...answer.answertranslation]
          : [];
        const newTranslations = [...values.answertranslation];
        const translationsToAdd: Array<AnswerTranslationInsert> = [
          ...newTranslations,
        ]
          .filter((el) => el.id === undefined)
          .map((el) => ({
            answer: idAnswer as number,
            label: el.label,
            language: el.language.id,
            otherlabel: el.otherlabel,
          }));
        const translationsToModify = [...newTranslations]
          .filter((el) => {
            const isExist = [...previousTranslations].find(
              (previous) => previous.id === el.id,
            );
            return isExist;
          })
          .filter((el) => el.id !== undefined)
          .map(
            (el) =>
              ({
                id: el.id,
                answer: idAnswer,
                label: el.label,
                language: el.language.id,
                otherlabel: el.otherlabel,
              }) as AnswerTranslationUpdate,
          );
        const translationsToDelete = [...previousTranslations]
          .filter((el) => {
            const isExist = [...newTranslations].find(
              (previous) => previous.id === el.id,
            );
            return !isExist;
          })
          .map((el) => el.id) as Array<number>;
        if (translationsToAdd.length > 0) {
          await insertAnswerTranslation(translationsToAdd);
        }
        if (translationsToModify.length > 0) {
          await updateAnswerTranslation(translationsToModify);
        }
        if (translationsToDelete.length > 0) {
          await deleteAnswerTranslationByIds(translationsToDelete);
        }
        validate();
      } catch (err) {
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
              <ImageQCMBlock src={formik.values.image} />
            </Grid>
          )}
          <Grid size={12}>
            <FieldArray name="answertranslation">
              {({ push, remove }) => {
                const idLanguageUsed = [...formik.values.answertranslation].map(
                  (el) => el.language.id,
                );
                const languageNotUsed = [...languages].filter(
                  (lang) => !idLanguageUsed.includes(lang.id),
                );
                return (
                  <Grid container spacing={2}>
                    {[...formik.values.answertranslation].map((_, index) => {
                      const value = formik.values.answertranslation[index];
                      return (
                        <>
                          <Grid
                            key={index}
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            size={12}
                          >
                            <SelectLanguage
                              value={value.language}
                              languages={languageNotUsed}
                              onChange={(value) =>
                                formik.setFieldValue(
                                  `themetranslation.${index}.language`,
                                  value,
                                )
                              }
                            />
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              <TextField
                                name={`answertranslation.${index}.label`}
                                value={value.label}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: px(5),
                                }}
                              >
                                <TextField
                                  label={t("commun.otherresponse")}
                                  size="small"
                                  name="otherLabel"
                                  value={value.tempOtherLabel ?? ""}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                  ) =>
                                    formik.setFieldValue(
                                      `answertranslation.${index}.tempOtherLabel`,
                                      event.target.value,
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();

                                      const newValue =
                                        value.tempOtherLabel?.trim();
                                      if (newValue && newValue !== "") {
                                        formik.setFieldValue(
                                          `answertranslation.${index}.otherlabel`,
                                          [...value.otherlabel, newValue],
                                        );
                                        formik.setFieldValue(
                                          `answertranslation.${index}.tempOtherLabel`,
                                          "",
                                        );
                                      }
                                    }
                                  }}
                                  fullWidth
                                />
                                <Box sx={{ display: "flex", gap: px(5) }}>
                                  {value.otherlabel.map((el, i) => (
                                    <Chip
                                      key={i}
                                      label={el}
                                      onDelete={() => {
                                        const newList = value.otherlabel.filter(
                                          (_, idx) => idx !== i,
                                        );
                                        formik.setFieldValue(
                                          `answertranslation.${index}.otherlabel`,
                                          newList,
                                        );
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Box>

                            <IconButton
                              aria-label="delete"
                              onClick={() => remove(index)}
                            >
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                          <Grid size={12}>
                            <Divider />
                          </Grid>
                        </>
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
                  </Grid>
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
