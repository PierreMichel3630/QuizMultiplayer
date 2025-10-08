import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { deburr } from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  deleteCategoryByIds,
  insertCategoryTheme,
  updateCategories,
} from "src/api/category";
import { BUCKET_THEME, storeFile, URL_STORAGE } from "src/api/storage";
import {
  insertThemeAdmin,
  insertThemeTranslations,
  updateTheme,
  updateThemeTranslations,
} from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { SelectCategory, SelectLanguage } from "src/component/Select";
import { FileUploadInput } from "src/component/input/FileUploadInput";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Theme, ThemeTranslationUpdate } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { removeAccentsAndLowercase } from "src/utils/string";
import * as Yup from "yup";

interface Props {
  theme: Theme | null;
  validate: () => void;
}

interface CategoryTheme {
  id: number;
  category: number;
  isfirst: boolean;
}

interface CategoryThemeInsert {
  id?: number;
  category: number;
  isfirst: boolean;
}

export const ThemeForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { languages, language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    color: string;
    image: null | File | string | undefined;
    id?: number;
    themetranslation: Array<{
      id?: number;
      name: string;
      language: Language;
    }>;
    categorytheme: Array<{
      id?: number;
      category: number | null;
      isfirst: boolean;
    }>;
  } = {
    id: theme ? theme.id : undefined,
    color: theme ? theme.color : "",
    image: theme ? theme.image : null,
    themetranslation: theme
      ? [...theme.themetranslation]
      : [{ name: "", language: language! }],
    categorytheme:
      theme && theme?.categorytheme.length > 0
        ? [...theme.categorytheme]
        : [{ category: 1, isfirst: false }],
  };

  const validationSchema = Yup.object().shape({
    color: Yup.string(),
    image: Yup.mixed().nullable(),
    themetranslation: Yup.array().min(
      0,
      t("form.createtheme.requiredlanguage")
    ),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let image: null | string = null;
        const title = values.themetranslation[0].name;
        if (values.image !== null && typeof values.image !== "string") {
          const name =
            "logo" +
            "-" +
            deburr(title).replace(/\s/g, "") +
            "-" +
            moment().toISOString();

          const { data } = await storeFile(
            BUCKET_THEME,
            name,
            values.image as unknown as File
          );
          image = data !== null ? data.path : null;
        } else {
          image = values.image;
        }
        const newTheme = {
          language: language ? language.iso : "fr-FR",
          image:
            image !== null && typeof values.image !== "string"
              ? URL_STORAGE + BUCKET_THEME + "/" + image
              : image,
          color: values.color,
          title: title,
          titlelower: removeAccentsAndLowercase(title),
          name: { "fr-FR": title },
        };
        const { error, data } = theme
          ? await updateTheme({ id: theme.id, ...newTheme })
          : await insertThemeAdmin({
              ...newTheme,
              validate: true,
              enabled: true,
            });
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          // TRANSLATIONS
          const previousTranslations = theme ? [...theme.themetranslation] : [];
          const newTranslations = [...values.themetranslation];
          const translationsToAdd = [...newTranslations]
            .filter((el) => el.id === undefined)
            .map((el) => ({
              ...el,
              theme: data.id,
              language: el.language.id,
              namelower: removeAccentsAndLowercase(el.name),
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
              theme: data.id,
              language: el.language.id,
              namelower: removeAccentsAndLowercase(el.name),
            })) as Array<ThemeTranslationUpdate>;
          const translationsToDelete = [...previousTranslations]
            .filter((el) => {
              const isExist = [...newTranslations].find(
                (previous) => previous.id === el.id
              );
              return !isExist;
            })
            .map((el) => el.id) as Array<number>;
          if (translationsToAdd.length > 0) {
            await insertThemeTranslations(translationsToAdd);
          }
          if (translationsToModify.length > 0) {
            await updateThemeTranslations(translationsToModify);
          }
          if (translationsToDelete.length > 0) {
            await deleteCategoryByIds(translationsToDelete);
          }

          // CATEGORIES
          const previousCategories = theme ? [...theme.categorytheme] : [];
          const newCategories = [...values.categorytheme].filter(
            (el) => el.category !== null
          ) as Array<CategoryThemeInsert>;
          const categoriesToAdd = [...newCategories]
            .filter((el) => el.id === undefined)
            .map((el) => ({ ...el, theme: data.id }));
          const categoriesToModify = [...newCategories]
            .filter((el) => {
              const isExist = [...previousCategories].find(
                (previous) => previous.id === el.id
              );
              return isExist;
            })
            .filter((el) => el.id !== undefined)
            .map((el) => ({ ...el, theme: data.id })) as Array<CategoryTheme>;
          const categoriesToDelete = [...previousCategories]
            .filter((el) => {
              const isExist = [...newCategories].find(
                (previous) => previous.id === el.id
              );
              return !isExist;
            })
            .map((el) => el.id) as Array<number>;

          if (categoriesToAdd.length > 0) {
            await insertCategoryTheme(categoriesToAdd);
          }
          if (categoriesToModify.length > 0) {
            await updateCategories(categoriesToModify);
          }
          if (categoriesToDelete.length > 0) {
            await deleteCategoryByIds(categoriesToDelete);
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
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={Boolean(formik.touched.color && formik.errors.color)}
            >
              <InputLabel htmlFor="color-input">
                {t("form.createtheme.color")}
              </InputLabel>
              <OutlinedInput
                id="color-input"
                type="text"
                value={formik.values.color}
                name="color"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label={t("form.createtheme.color")}
                inputProps={{}}
              />
              {formik.touched.color && formik.errors.color && (
                <FormHelperText error id="error-color">
                  {formik.errors.color}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{t("form.createtheme.logo")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <FileUploadInput
              formik={formik}
              field="image"
              maxWidth={150}
              maxSize={50}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>
              <Typography variant="h4">{t("commun.translations")}</Typography>
            </Divider>
          </Grid>
          <FieldArray name="themetranslation">
            {({ push, remove }) => {
              const idLanguageUsed = [...formik.values.themetranslation].map(
                (el) => el.language.id
              );
              const languageNotUsed = [...languages].filter(
                (lang) => !idLanguageUsed.includes(lang.id)
              );
              return (
                <>
                  {[...formik.values.themetranslation].map((_, index) => {
                    const value = formik.values.themetranslation[index];
                    return (
                      <Grid
                        item
                        xs={12}
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <SelectLanguage
                          value={value.language}
                          languages={languageNotUsed}
                          onChange={(value) =>
                            formik.setFieldValue(
                              `themetranslation.${index}.language`,
                              value
                            )
                          }
                        />
                        <TextField
                          name={`themetranslation.${index}.name`}
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
                    <Grid item xs={6}>
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
          <Grid item xs={12}>
            <Divider>
              <Typography variant="h4">{t("commun.categories")}</Typography>
            </Divider>
          </Grid>
          <FieldArray name="categorytheme">
            {({ push, remove }) => {
              return (
                <>
                  {[...formik.values.categorytheme].map((_, index) => {
                    const value = formik.values.categorytheme[index];
                    return (
                      <Grid
                        item
                        xs={12}
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <SelectCategory
                          value={value.category}
                          onChange={(value) =>
                            formik.setFieldValue(
                              `categorytheme.${index}.category`,
                              value
                            )
                          }
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
                  <Grid item xs={6}>
                    <ButtonColor
                      value={Colors.blue}
                      label={t("commun.addcategory")}
                      icon={AddCircleIcon}
                      variant="contained"
                      onClick={() => push({ category: null, isfirst: false })}
                    />
                  </Grid>
                </>
              );
            }}
          </FieldArray>
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.green}
              label={t("commun.validate")}
              icon={CheckIcon}
              variant="contained"
              type="submit"
            />
          </Grid>
        </Grid>
      </form>
    </FormikProvider>
  );
};
