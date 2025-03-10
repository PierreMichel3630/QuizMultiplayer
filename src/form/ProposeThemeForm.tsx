import CheckIcon from "@mui/icons-material/Check";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { insertTheme } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { useMessage } from "src/context/MessageProvider";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  validate: () => void;
}

export const ProposeThemeForm = ({ validate }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    name: string;
    color: string;
  } = {
    name: "",
    color: Colors.blue2,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("form.proposetheme.requiredname")),
    color: Yup.string().required(t("form.proposetheme.requiredcolor")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newTheme = {
          name: { "fr-FR": values.name, "en-US": values.name },
          color: values.color,
        };
        const { error } = await insertTheme(newTheme);
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
            error={Boolean(formik.touched.name && formik.errors.name)}
          >
            <InputLabel htmlFor="name-input">
              {t("form.proposetheme.name")}
            </InputLabel>
            <OutlinedInput
              id="name-input"
              type="text"
              value={formik.values.name}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.proposetheme.name")}
              inputProps={{}}
            />
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error id="error-namefr">
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
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
  );
};
