import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, IconButton, TextField } from "@mui/material";
import { FieldArray, Formik } from "formik";
import { useTranslation } from "react-i18next";
import {
  deleteCategoryTranslationById,
  insertCategory,
  insertCategoryTranslation,
  updateCategoryTranslation,
} from "src/api/category";
import { ButtonColor } from "src/component/Button";
import { SelectLanguage } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { removeAccentsAndLowercase } from "src/utils/string";
import * as Yup from "yup";

interface Props {
  category: Category | null;
  validate: () => void;
}

export const CategoryForm = ({ validate, category }: Props) => {
  const { t } = useTranslation();
  const { languages, language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    id?: number;
    traductions: Array<{
      id?: number;
      name: string;
      language: Language;
    }>;
  } = {
    id: category ? category.id : undefined,
    traductions: category
      ? [...category.categorytranslation]
      : [{ name: "", language: language! }],
  };

  const validationSchema = Yup.object().shape({
    traductions: Yup.array().min(0, t("form.createtheme.requiredlanguage")),
  });

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          let categoryId = values.id;
          if (categoryId === undefined) {
            const { data, error } = await insertCategory({});
            if (error) {
              throw error;
            } else {
              categoryId = data.id;
            }
          }
          if (categoryId !== undefined) {
            const previousId = category
              ? [...category.categorytranslation].map((el) => el.id)
              : [];
            const newId = [...values.traductions].map((el) => el.id);
            const idToDelete = previousId.filter((el) => !newId.includes(el));

            if (idToDelete.length > 0) {
              await deleteCategoryTranslationById(idToDelete);
            }
            await Promise.all(
              [...values.traductions].map(async (trad) => {
                if (trad.id) {
                  const { error } = await updateCategoryTranslation({
                    id: trad.id,
                    name: trad.name,
                    language: trad.language.id,
                    namelower: removeAccentsAndLowercase(trad.name),
                  });
                  if (error) throw error;
                } else {
                  const { error } = await insertCategoryTranslation({
                    name: trad.name,
                    category: categoryId as number,
                    language: trad.language.id,
                    namelower: removeAccentsAndLowercase(trad.name),
                  });
                  if (error) throw error;
                }
              })
            );
            validate();
          } else {
            throw new Error("Category not defined");
          }
        } catch (err) {
          setSeverity("error");
          setMessage(t("commun.error"));
        }
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <FieldArray name="traductions">
              {({ push, remove }) => {
                const idLanguageUsed = [...values.traductions].map(
                  (el) => el.language.id
                );
                const languageNotUsed = [...languages].filter(
                  (lang) => !idLanguageUsed.includes(lang.id)
                );
                return (
                  <>
                    {values.traductions.map((_, index) => {
                      const value = values.traductions[index];
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
                              setFieldValue(
                                `traductions.${index}.language`,
                                value
                              )
                            }
                          />
                          <TextField
                            name={`traductions.${index}.name`}
                            label="Nom"
                            value={value.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
      )}
    </Formik>
  );
};
