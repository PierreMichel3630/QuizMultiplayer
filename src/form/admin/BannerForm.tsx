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
import { insertBanner, updateBanner } from "src/api/banner";
import { BUCKET_AVATAR, URL_STORAGE, storeFile } from "src/api/storage";
import { ButtonColor } from "src/component/Button";
import { SelectThemeShop } from "src/component/Select";
import { FileUploadInput } from "src/component/input/FileUploadInput";
import { useMessage } from "src/context/MessageProvider";
import { Banner } from "src/models/Banner";
import { ThemeShop } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  banner?: Banner;
  validate: () => void;
}

export const BannerForm = ({ validate, banner }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    src: null | File | string | undefined;
    price: number;
    isaccomplishment: boolean;
    theme: null | ThemeShop;
  } = {
    isaccomplishment: banner ? banner.isaccomplishment : false,
    price: banner ? banner.price : 0,
    src: banner ? banner.src : null,
    theme: banner ? banner.theme : null,
  };

  const validationSchema = Yup.object().shape({
    price: Yup.string().required(t("form.createbanner.requiredprice")),
    isaccomplishment: Yup.boolean(),
    src: Yup.mixed().nullable(),
    theme: Yup.object()
      .shape({ id: Yup.number().required() })
      .default(null)
      .required(t("form.createbanner.requiredtheme")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let icon: null | string = null;
        if (values.src !== null && typeof values.src !== "string") {
          const name = "banner" + "-" + moment().toISOString();

          const { data } = await storeFile(
            BUCKET_AVATAR,
            name,
            values.src as unknown as File
          );
          icon = data !== null ? data.path : null;
        } else {
          icon = values.src;
        }
        const newValue = {
          price: values.price,
          src:
            icon !== null && typeof values.src !== "string"
              ? URL_STORAGE + BUCKET_AVATAR + "/" + icon
              : icon,
          isaccomplishment: values.isaccomplishment,
          theme: values.theme ? values.theme.id : null,
        };
        const { error } = banner
          ? await updateBanner({ id: banner.id, ...newValue })
          : await insertBanner(newValue);
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
            <InputLabel htmlFor="price-input">
              {t("form.createbanner.price")}
            </InputLabel>
            <OutlinedInput
              id="namefr-input"
              type="number"
              value={formik.values.price}
              name="price"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createbanner.price")}
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
          <Typography variant="h6">{t("form.createbanner.icon")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FileUploadInput
            formik={formik}
            field="src"
            maxWidth={900}
            maxSize={300}
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
