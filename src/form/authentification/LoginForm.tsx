import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { percent, px } from "csx";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setUuid } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue = {
    email: "",
    password: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("form.login.formatmail"))
      .max(255)
      .required(t("form.login.requiredmail")),
    password: Yup.string().max(255).required(t("form.login.requiredpassword")),
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
        (document.activeElement as HTMLElement)?.blur();
        const {
          data: { user, session },
          error,
        } = await login(values.email, values.password);
        if (error) {
          if (error.message === "Invalid login credentials") {
            setSeverity("error");
            setMessage(t("form.login.errorconnect"));
          } else {
            setSeverity("error");
            setMessage(t("commun.error"));
          }
        }
        if (user && session) {
          setUuid(user.id);
          navigate("/");
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        width: percent(100),
        height: percent(100),
        display: "flex",
        flexDirection: "column",
        gap: px(15),
      }}
    >
      <Box>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4">{t("commun.login")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={Boolean(formik.touched.email && formik.errors.email)}
            >
              <InputLabel htmlFor="login-email-input">
                {t("form.login.email")}
              </InputLabel>
              <OutlinedInput
                id="login-email-input"
                type="email"
                value={formik.values.email}
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label={t("form.login.email")}
                inputProps={{}}
              />
              {formik.touched.email && formik.errors.email && (
                <FormHelperText error id="login-error-email">
                  {formik.errors.email}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={Boolean(formik.touched.password && formik.errors.password)}
              color="primary"
            >
              <InputLabel htmlFor="login-password-input">
                {t("form.login.password")}
              </InputLabel>
              <OutlinedInput
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                name="password"
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
                label={t("form.login.password")}
                inputProps={{}}
              />
              {formik.touched.password && formik.errors.password && (
                <FormHelperText error id="login-error-password">
                  {formik.errors.password}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right", mb: 2 }}>
            <Link to="/forgotpassword">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.login.forgotpassword")}
              </Typography>
            </Link>
          </Grid>
          {formik.errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{formik.errors.submit}</FormHelperText>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              color="secondary"
              variant="contained"
            >
              {t("form.login.connect")}
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              {t("form.login.haveaccount")}
            </Typography>
          </Grid>
          <Grid item>
            <Link to="/register">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.login.createaccount")}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};
