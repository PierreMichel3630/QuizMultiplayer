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
import { insertTitle, updateTitle } from "src/api/title";
import { ButtonColor } from "src/component/Button";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  title?: Title;
  validate: () => void;
}

export const TitleForm = ({ title, validate }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    name: string;
    price: number;
    isaccomplishment: boolean;
  } = {
    name: title ? title.name[language.iso] : "",
    isaccomplishment: title ? title.isaccomplishment : false,
    price: title ? title.price : 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("form.createtitle.requiredname")),
    price: Yup.string().required(t("form.createtitle.requiredprice")),
    isaccomplishment: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newTitle = {
          name: {
            [language.iso]: values.name,
          },
          price: values.price,
          isaccomplishment: values.isaccomplishment,
        };
        const { error } = title
          ? await updateTitle({ id: title.id, ...newTitle })
          : await insertTitle(newTitle);
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
              {t("form.createtitle.name")}
            </InputLabel>
            <OutlinedInput
              id="name-input"
              type="text"
              value={formik.values.name}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtitle.name")}
              inputProps={{}}
            />
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error id="error-name">
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.price && formik.errors.price)}
          >
            <InputLabel htmlFor="price-input">
              {t("form.createtitle.price")}
            </InputLabel>
            <OutlinedInput
              id="price-input"
              type="number"
              value={formik.values.price}
              name="price"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtitle.price")}
              inputProps={{}}
            />
            {formik.touched.price && formik.errors.price && (
              <FormHelperText error id="error-price">
                {formik.errors.price}
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
