import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  deleteTitleTranslations,
  insertTitle,
  insertTitleTranslations,
  updateTitle,
  updateTitleTranslations,
} from "src/api/title";
import { ButtonColor } from "src/component/Button";
import { SelectLanguage } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Title, TitleTranslationUpdate } from "src/models/Title";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  title: Title | null;
  validate: () => void;
}

export const TitleForm = ({ title, validate }: Props) => {
  const { t } = useTranslation();
  const { languages, language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    titletranslation: Array<{
      id?: number;
      name: string;
      language: Language;
    }>;
    price: number;
    isaccomplishment: boolean;
  } = {
    titletranslation: title
      ? [...title.titletranslation]
      : [{ name: "", language: language! }],
    isaccomplishment: title ? title.isaccomplishment : false,
    price: title ? title.price : 0,
  };

  const validationSchema = Yup.object().shape({
    titletranslation: Yup.array().min(
      0,
      t("form.createtitle.requiredlanguage")
    ),
    price: Yup.string().required(t("form.createtitle.requiredprice")),
    isaccomplishment: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const translationMap = [...values.titletranslation].reduce(
          (acc, item) => {
            acc[item.language.iso] = item.name;
            return acc;
          },
          {} as Record<string, string>
        );
        const newTitle = {
          name: translationMap,
          price: values.price,
          isaccomplishment: values.isaccomplishment,
        };
        const { error, data } = title
          ? await updateTitle({ id: title.id, ...newTitle })
          : await insertTitle(newTitle);
        if (error) throw error;
        // TRANSLATIONS
        const previousTranslations = title ? [...title.titletranslation] : [];
        const newTranslations = [...values.titletranslation];
        const translationsToAdd = [...newTranslations]
          .filter((el) => el.id === undefined)
          .map((el) => ({
            ...el,
            title: data.id,
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
          .map((el) => ({
            ...el,
            title: data.id,
            language: el.language.id,
          })) as Array<TitleTranslationUpdate>;
        const translationsToDelete = [...previousTranslations]
          .filter((el) => {
            const isExist = [...newTranslations].find(
              (previous) => previous.id === el.id
            );
            return !isExist;
          })
          .map((el) => el.id) as Array<number>;
        if (translationsToAdd.length > 0) {
          await insertTitleTranslations(translationsToAdd);
        }
        if (translationsToModify.length > 0) {
          await updateTitleTranslations(translationsToModify);
        }
        if (translationsToDelete.length > 0) {
          await deleteTitleTranslations(translationsToDelete);
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
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <FieldArray name="titletranslation">
            {({ push, remove }) => {
              const idLanguageUsed = [...formik.values.titletranslation].map(
                (el) => el.language.id
              );
              const languageNotUsed = [...languages].filter(
                (lang) => !idLanguageUsed.includes(lang.id)
              );
              return (
                <>
                  {[...formik.values.titletranslation].map((_, index) => {
                    const value = formik.values.titletranslation[index];
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
                              `titletranslation.${index}.language`,
                              value
                            )
                          }
                        />
                        <TextField
                          name={`titletranslation.${index}.name`}
                          label="Nom"
                          value={value.name}
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
                    <Grid size={6}>
                      <ButtonColor
                        value={Colors.blue}
                        label={t("commun.addtranslation")}
                        icon={AddCircleIcon}
                        variant="contained"
                        onClick={() =>
                          push({ name: "", language: languageNotUsed[0] })
                        }
                      />
                    </Grid>
                  )}
                </>
              );
            }}
          </FieldArray>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <FormControl
              fullWidth
              error={Boolean(formik.touched.price && formik.errors.price)}
            >
              <InputLabel htmlFor="price-input">
                {t("form.createtitle.price")}
              </InputLabel>
              <OutlinedInput
                id="price-input"
                type="number"
                value={formik.values.price}
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label={t("form.createtitle.price")}
                inputProps={{}}
              />
              {formik.touched.price && formik.errors.price && (
                <FormHelperText error id="error-price">
                  {formik.errors.price}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={12}>
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
    </FormikProvider>
  );
};
