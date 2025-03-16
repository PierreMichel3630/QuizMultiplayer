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
import { Category } from "src/models/Category";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  category: Category | undefined;
  validate: () => void;
}

export const CategoryForm = ({ validate, category }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    namefr: string;
    nameen: string;
  } = {
    namefr: category ? category.name["fr-FR"] : "",
    nameen: category ? category.name["en-US"] : "",
  };

  const validationSchema = Yup.object().shape({
    namefr: Yup.string().required(t("form.createcategory.requirednamefr")),
    nameen: Yup.string().required(t("form.createcategory.requirednameen")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newValue = {
          name: { "fr-FR": values.namefr, "en-US": values.nameen },
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
