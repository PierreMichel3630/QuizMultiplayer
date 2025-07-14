import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import deburr from "lodash.deburr";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { insertCategoryTheme } from "src/api/category";
import { BUCKET_THEME, URL_STORAGE, storeFile } from "src/api/storage";
import { insertThemeAdmin, updateTheme } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { SelectCategory, SelectIso } from "src/component/Select";
import { FileUploadInput } from "src/component/input/FileUploadInput";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { removeAccentsAndLowercase } from "src/utils/string";
import * as Yup from "yup";

interface Props {
  theme: Theme | undefined;
  validate: () => void;
}

export const ThemeForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    title: string;
    color: string;
    image: null | File | string | undefined;
    category: null | Category;
    language: string;
  } = {
    title: theme ? theme.title : "",
    color: theme ? theme.color : "",
    image: theme ? theme.image : null,
    category: theme ? theme.category : null,
    language: theme ? theme.language : language.iso,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("form.createtheme.requirednamefr")),
    color: Yup.string(),
    image: Yup.mixed().nullable(),
    category: Yup.object()
      .shape({ id: Yup.number().required() })
      .default(null)
      .required(t("form.createtheme.requiredcategory")),
    language: Yup.string().required(t("form.createtheme.requiredlanguage")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let image: null | string = null;
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
            error={Boolean(formik.touched.category && formik.errors.category)}
          >
            <SelectCategory
              category={formik.values.category}
              onChange={(value) => formik.setFieldValue("category", value)}
            />
            <FormHelperText error id={`error-category`}>
              {formik.errors.category}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.language && formik.errors.language)}
          >
            <SelectIso
              value={formik.values.language}
              onChange={(value) => formik.setFieldValue("language", value)}
            />
            <FormHelperText error id={`error-language`}>
              {formik.errors.language}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.title && formik.errors.title)}
          >
            <InputLabel htmlFor="title-input">
              {t("form.createtheme.title")}
            </InputLabel>
            <OutlinedInput
              id="title-input"
              type="text"
              value={formik.values.title}
              name="title"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtheme.title")}
              inputProps={{}}
            />
            {formik.touched.title && formik.errors.title && (
              <FormHelperText error id="error-title">
                {formik.errors.title}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
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
