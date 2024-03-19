import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";

export const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { setMessage, setSeverity } = useMessage();

  const initialValue = {
    password: "",
    confirmpassword: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t("form.register.minpassword"))
      .required(t("form.register.requiredpassword")),
    confirmpassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      t("form.register.passwordmatch")
    ),
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { error } = await updatePassword(values.password);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          navigate("/login");
        }
      } catch (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel htmlFor="reset-password-input">
              {t("form.resetpassword.password")}
            </InputLabel>
            <OutlinedInput
              id="register-password-input"
              type="password"
              value={formik.values.password}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.password")}
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error id="register-error-email">
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.confirmpassword && formik.errors.confirmpassword
            )}
          >
            <InputLabel htmlFor="reset-confirmpassword-input">
              {t("form.resetpassword.confirmpassword")}
            </InputLabel>
            <OutlinedInput
              id="reset-confirmpassword-input"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmpassword}
              name="confirmpassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("form.resetpassword.confirmpassword")}
              inputProps={{}}
            />
            {formik.touched.confirmpassword &&
              formik.errors.confirmpassword && (
                <FormHelperText error id="reset-error-confirmpassword">
                  {formik.errors.confirmpassword}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>
        {formik.errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            disableElevation
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            {t("form.resetpassword.continue")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
