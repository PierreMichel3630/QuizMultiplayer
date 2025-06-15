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
import moment from "moment";
import { useTranslation } from "react-i18next";
import { insertAvatar, updateAvatar } from "src/api/avatar";
import { BUCKET_AVATAR, URL_STORAGE, storeFile } from "src/api/storage";
import { ButtonColor } from "src/component/Button";
import { SelectThemeShop } from "src/component/Select";
import { FileUploadInput } from "src/component/input/FileUploadInput";
import { useMessage } from "src/context/MessageProvider";
import { Avatar } from "src/models/Avatar";
import { ThemeShop } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  avatar?: Avatar;
  validate: () => void;
}

export const AvatarForm = ({ validate, avatar }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  console.log(avatar);

  const initialValue: {
    icon: null | File | string | undefined;
    price: number;
    isaccomplishment: boolean;
    theme: null | ThemeShop;
  } = {
    isaccomplishment: avatar ? avatar.isaccomplishment : false,
    price: avatar ? avatar.price : 0,
    icon: avatar ? avatar.icon : null,
    theme: avatar ? avatar.theme : null,
  };

  const validationSchema = Yup.object().shape({
    price: Yup.string().required(t("form.createavatar.requiredprice")),
    isaccomplishment: Yup.boolean(),
    icon: Yup.mixed().nullable(),
    theme: Yup.object()
      .shape({ id: Yup.number().required() })
      .default(null)
      .required(t("form.createavatar.requiredtheme")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let icon: null | string = null;
        if (values.icon !== null && typeof values.icon !== "string") {
          const name = "avatar" + "-" + moment().toISOString();

          const { data } = await storeFile(
            BUCKET_AVATAR,
            name,
            values.icon as unknown as File
          );
          icon = data !== null ? data.path : null;
        } else {
          icon = values.icon;
        }
        const newAvatar = {
          price: values.price,
          icon:
            icon !== null && typeof values.icon !== "string"
              ? URL_STORAGE + BUCKET_AVATAR + "/" + icon
              : icon,
          isaccomplishment: values.isaccomplishment,
          theme: values.theme ? values.theme.id : null,
        };
        const { error } = avatar
          ? await updateAvatar({ id: avatar.id, ...newAvatar })
          : await insertAvatar(newAvatar);
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
            error={Boolean(formik.touched.theme && formik.errors.theme)}
          >
            <SelectThemeShop
              theme={formik.values.theme}
              onChange={(value) => formik.setFieldValue("theme", value)}
            />
            <FormHelperText error id={`error-theme`}>
              {formik.errors.theme}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.price && formik.errors.price)}
          >
            <InputLabel htmlFor="namefr-input">
              {t("form.createavatar.price")}
            </InputLabel>
            <OutlinedInput
              id="namefr-input"
              type="number"
              value={formik.values.price}
              name="price"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createavatar.price")}
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
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t("form.createavatar.icon")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FileUploadInput formik={formik} field="icon" />
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
