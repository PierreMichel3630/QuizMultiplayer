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
import { insertTheme, updateTheme } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { SelectCategory } from "src/component/Select";
import { FileUploadInput } from "src/component/input/FileUploadInput";
import { useMessage } from "src/context/MessageProvider";
import { Category } from "src/models/Category";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  theme: Theme | undefined;
  validate: () => void;
}

export const ThemeForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    namefr: string;
    nameen: string;
    color: string;
    image: null | File | string;
    background: null | File | string;
    category: null | Category;
  } = {
    namefr: theme ? theme.name["fr-FR"] : "",
    nameen: theme ? theme.name["en-US"] : "",
    color: theme ? theme.color : "",
    image: theme ? theme.image : null,
    background: theme ? theme.background : null,
    category: theme ? theme.category : null,
  };

  const validationSchema = Yup.object().shape({
    namefr: Yup.string().required(t("form.createtheme.requirednamefr")),
    nameen: Yup.string().required(t("form.createtheme.requirednameen")),
    color: Yup.string(),
    image: Yup.mixed().nullable(),
    background: Yup.mixed().nullable(),
    category: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let image: null | string = null;
        let background: null | string = null;
        if (values.image !== null && typeof values.image !== "string") {
          const name =
            "logo" +
            "-" +
            deburr(values.namefr).replace(/\s/g, "") +
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
        if (
          values.background !== null &&
          typeof values.background !== "string"
        ) {
          const name =
            "background" +
            "-" +
            deburr(values.namefr).replace(/\s/g, "") +
            "-" +
            moment().toISOString();

          const { data } = await storeFile(
            BUCKET_THEME,
            name,
            values.background as unknown as File
          );
          background = data !== null ? data.path : null;
        } else {
          background = values.background;
        }
        const newTheme = {
          name: { "fr-FR": values.namefr, "en-US": values.nameen },
          image:
            image !== null && typeof values.image !== "string"
              ? URL_STORAGE + BUCKET_THEME + "/" + image
              : image,
          color: values.color,
          background:
            background !== null && typeof values.background !== "string"
              ? URL_STORAGE + BUCKET_THEME + "/" + background
              : background,
        };
        const { error, data } = theme
          ? await updateTheme({ id: theme.id, ...newTheme })
          : await insertTheme(newTheme);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          if (!theme) {
            const insertCategory = {
              theme: data.id,
              category: values.category ? values.category.id : 1,
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
            error={Boolean(formik.touched.namefr && formik.errors.namefr)}
          >
            <InputLabel htmlFor="namefr-input">
              {t("form.createtheme.namefr")}
            </InputLabel>
            <OutlinedInput
              id="namefr-input"
              type="text"
              value={formik.values.namefr}
              name="namefr"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtheme.namefr")}
              inputProps={{}}
            />
            {formik.touched.namefr && formik.errors.namefr && (
              <FormHelperText error id="error-namefr">
                {formik.errors.namefr}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.nameen && formik.errors.nameen)}
          >
            <InputLabel htmlFor="nameen-input">
              {t("form.createtheme.nameen")}
            </InputLabel>
            <OutlinedInput
              id="nameen-input"
              type="text"
              value={formik.values.nameen}
              name="nameen"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtheme.nameen")}
              inputProps={{}}
            />
            {formik.touched.nameen && formik.errors.nameen && (
              <FormHelperText error id="error-nameen">
                {formik.errors.nameen}
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
          <FileUploadInput formik={formik} field="image" />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            {t("form.createtheme.background")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FileUploadInput formik={formik} field="background" />
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
