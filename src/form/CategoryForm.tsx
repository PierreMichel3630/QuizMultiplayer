import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { insertCategory, updateCategory } from "src/api/category";
import { ButtonColor } from "src/component/Button";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  category: Category | undefined;
  validate: () => void;
}

export const CategoryForm = ({ validate, category }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    title: string;
    language: string;
  } = {
    title: category ? category.title : "",
    language: language.iso,
  };

  const validationSchema = Yup.object().shape({
    namefr: Yup.string().required(t("form.createcategory.requirednamefr")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newValue = {
          title: values.title,
          language: values.language,
        };
        const { error } = category
          ? await updateCategory({ id: category.id, ...newValue })
          : await insertCategory(newValue);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
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
