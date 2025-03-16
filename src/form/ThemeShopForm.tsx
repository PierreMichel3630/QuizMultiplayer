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
import { insertShopTheme, updateShopTheme } from "src/api/shop";
import { ButtonColor } from "src/component/Button";
import { useMessage } from "src/context/MessageProvider";
import { ThemeShop } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  theme?: ThemeShop;
  validate: () => void;
}

export const ThemeShopForm = ({ validate, theme }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    namefr: string;
    nameen: string;
  } = {
    namefr: theme ? theme.name["fr-FR"] : "",
    nameen: theme ? theme.name["en-US"] : "",
  };

  const validationSchema = Yup.object().shape({
    namefr: Yup.string().required(t("form.createthemeshop.requirednamefr")),
    nameen: Yup.string().required(t("form.createthemeshop.requirednameen")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newValue = {
          name: { "fr-FR": values.namefr, "en-US": values.nameen },
        };
        const { error } = theme
          ? await updateShopTheme({ id: theme.id, ...newValue })
          : await insertShopTheme(newValue);
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
              {t("form.createthemeshop.namefr")}
            </InputLabel>
            <OutlinedInput
              id="namefr-input"
              type="text"
              value={formik.values.namefr}
              name="namefr"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createthemeshop.namefr")}
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
              {t("form.createthemeshop.nameen")}
            </InputLabel>
            <OutlinedInput
              id="nameen-input"
              type="text"
              value={formik.values.nameen}
              name="nameen"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createthemeshop.nameen")}
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
