import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, IconButton, TextField } from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  deleteThemeShopTranslations,
  insertThemeShop,
  insertThemeShopTranslations,
  updateThemeShop,
  updateThemeShopTranslations,
} from "src/api/shop";
import { ButtonColor } from "src/component/Button";
import { SelectLanguage } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { ThemeShop, ThemeShopTranslationUpdate } from "src/models/Shop";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  theme?: ThemeShop;
  validate: () => void;
}

export const ThemeShopForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { languages, language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    themeshoptranslation: Array<{
      id?: number;
      name: string;
      language: Language;
    }>;
  } = {
    themeshoptranslation: theme
      ? [...theme.themeshoptranslation]
      : [{ name: "", language: language! }],
  };

  const validationSchema = Yup.object().shape({
    themeshoptranslation: Yup.array().min(
      0,
      t("form.createthemeshop.requiredlanguage")
    ),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const translationMap = [...values.themeshoptranslation].reduce(
          (acc, item) => {
            acc[item.language.iso] = item.name;
            return acc;
          },
          {} as Record<string, string>
        );
        const newValue = {
          name: translationMap,
        };
        const { data, error } = theme
          ? await updateThemeShop({ id: theme.id, ...newValue })
          : await insertThemeShop(newValue);
        if (error) {
          throw error;
        }
        // TRANSLATIONS
        const previousTranslations = theme
          ? [...theme.themeshoptranslation]
          : [];
        const newTranslations = [...values.themeshoptranslation];
        const translationsToAdd = [...newTranslations]
          .filter((el) => el.id === undefined)
          .map((el) => ({
            ...el,
            themeshop: data.id,
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
            themeshop: data.id,
            language: el.language.id,
          })) as Array<ThemeShopTranslationUpdate>;
        const translationsToDelete = [...previousTranslations]
          .filter((el) => {
            const isExist = [...newTranslations].find(
              (previous) => previous.id === el.id
            );
            return !isExist;
          })
          .map((el) => el.id) as Array<number>;
        if (translationsToAdd.length > 0) {
          await insertThemeShopTranslations(translationsToAdd);
        }
        if (translationsToModify.length > 0) {
          await updateThemeShopTranslations(translationsToModify);
        }
        if (translationsToDelete.length > 0) {
          await deleteThemeShopTranslations(translationsToDelete);
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
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <FieldArray name="themeshoptranslation">
            {({ push, remove }) => {
              const idLanguageUsed = [
                ...formik.values.themeshoptranslation,
              ].map((el) => el.language.id);
              const languageNotUsed = [...languages].filter(
                (lang) => !idLanguageUsed.includes(lang.id)
              );
              return (
                <>
                  {[...formik.values.themeshoptranslation].map((_, index) => {
                    const value = formik.values.themeshoptranslation[index];
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
                              `themeshoptranslation.${index}.language`,
                              value
                            )
                          }
                        />
                        <TextField
                          name={`themeshoptranslation.${index}.name`}
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
