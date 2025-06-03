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
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";
import { removeAccentsAndLowercase } from "src/utils/string";
import * as Yup from "yup";

interface Props {
  validate: () => void;
}

export const ProposeThemeForm = ({ validate }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    title: string;
    color: string;
    language: string;
  } = {
    title: "",
    color: Colors.blue2,
    language: language.iso,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("form.proposetheme.requiredname")),
    color: Yup.string().required(t("form.proposetheme.requiredcolor")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newTheme = {
          title: values.title,
          titlelower: removeAccentsAndLowercase(values.title),
          color: values.color,
          name: { "fr-FR": values.title, "en-US": values.title },
          language: values.language,
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
            error={Boolean(formik.touched.title && formik.errors.title)}
          >
            <InputLabel htmlFor="title-input">
              {t("form.proposetheme.title")}
            </InputLabel>
            <OutlinedInput
              id="title-input"
              type="text"
              value={formik.values.title}
              name="title"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.proposetheme.title")}
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
