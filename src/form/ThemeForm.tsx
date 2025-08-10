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
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { SelectLanguage } from "src/component/Select";
import { FileUploadInput } from "src/component/input/FileUploadInput";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  theme: Theme | null;
  validate: () => void;
}

export const ThemeForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { languages } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    color: string;
    image: null | File | string | undefined;
    id?: number;
    traductions: Array<{
      id?: number;
      name: string;
      language: Language;
    }>;
  } = {
    id: theme ? theme.id : undefined,
    color: theme ? theme.color : "",
    image: theme ? theme.image : null,
    traductions: theme ? [...theme.themetranslation] : [],
  };

  const validationSchema = Yup.object().shape({
    color: Yup.string(),
    image: Yup.mixed().nullable(),
    traductions: Yup.array().min(0, t("form.createtheme.requiredlanguage")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        validate();
        /*let image: null | string = null;
        if (values.image !== null && typeof values.image !== "string") {
          const name =
            "logo" +
            "-" +
            deburr(values.title).replace(/\s/g, "") +
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
          language: values.language,
          image:
            image !== null && typeof values.image !== "string"
              ? URL_STORAGE + BUCKET_THEME + "/" + image
              : image,
          color: values.color,
          title: values.title,
          titlelower: removeAccentsAndLowercase(values.title),
          name: { "fr-FR": values.title, "en-US": values.title },
        };
        const { error, data } = theme
          ? await updateTheme({ id: theme.id, ...newTheme })
          : await insertThemeAdmin(newTheme);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          if (data && values.category) {
            const insertCategory = {
              theme: data.id,
              category: values.category.id,
            };
            await insertCategoryTheme(insertCategory);
          }
          validate();
        }*/
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
          <FieldArray name="traductions">
            {({ push, remove }) => {
              const idLanguageUsed = [...formik.values.traductions].map(
                (el) => el.language.id
              );
              const languageNotUsed = [...languages].filter(
                (lang) => !idLanguageUsed.includes(lang.id)
              );
              return (
                <>
                  {[...formik.values.traductions].map((_, index) => {
                    const value = formik.values.traductions[index];
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
                              `traductions.${index}.language`,
                              value
                            )
                          }
                        />
                        <TextField
                          name={`traductions.${index}.name`}
                          label="Nom"
                          value={value.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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
                    <Grid item xs={12}>
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
            <ButtonColor
              value={Colors.green}
              label={t("commun.add")}
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
