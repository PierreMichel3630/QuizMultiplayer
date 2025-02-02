import {
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { selectAvatarFree } from "src/api/avatar";
import { signUpWithEmail } from "src/api/supabase";
import { AvatarLoginSelector } from "src/component/avatar/AvatarSelector";
import { RegisterCountryBlock } from "src/component/MyCountryBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Avatar } from "src/models/Avatar";
import { Country } from "src/models/Country";
import { countPlayersSameUsername } from "src/api/profile";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setUuid } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const [avatars, setAvatars] = useState<Array<Avatar>>([]);

  useEffect(() => {
    const getAvatars = () => {
      selectAvatarFree().then(({ data }) => {
        setAvatars(data ?? []);
      });
    };
    getAvatars();
  }, []);

  const initialValue: {
    email: string;
    username: string;
    password: string;
    submit: null;
    avatar: number;
    country: null | Country;
  } = {
    email: "",
    username: "",
    password: "",
    submit: null,
    avatar: 1,
    country: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("form.register.formatmail"))
      .max(255)
      .required(t("form.register.requiredmail")),
    username: Yup.string()
      .required(t("form.register.requiredusername"))
      .min(3, t("form.register.minusername"))
      .max(155, t("form.register.maxusername"))
      .test(
        "checkDuplicateUsername",
        t("form.register.duplicateusername"),
        (value) => {
          return new Promise((resolve) => {
            countPlayersSameUsername(value).then(({ count }) => {
              resolve(count === 0);
            });
          });
        }
      )
      .test("noSpace", t("form.register.nospaceusername"), (value) => {
        const trimValue = value.replace(/\s+/g, "");
        const isSpace = trimValue.length === value.length;
        return isSpace;
      }),
    password: Yup.string()
      .min(6, t("form.register.minpassword"))
      .required(t("form.register.requiredpassword")),
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
        const { error } = await signUpWithEmail(
          values.email,
          values.password,
          values.username,
          values.avatar,
          values.country !== null ? values.country.id : null
        );
        if (error) {
          setSeverity("error");
          setMessage(
            error.status === 422
              ? t("form.register.errorcreatemail")
              : t("commun.error")
          );
        } else {
          const {
            data: { user, session },
            error,
          } = await login(values.email, values.password);
          if (error) {
            setSeverity("error");
            setMessage(t("commun.error"));
          }
          if (user && session) {
            setUuid(user.id);
            navigate("/");
          }
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h4">
            {t("form.register.createaccount")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "right" }}>
          <Typography variant="caption">{t("form.mandatoryvalue")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.username && formik.errors.username)}
          >
            <InputLabel htmlFor="register-username-input">
              {t("form.register.username")}
            </InputLabel>
            <OutlinedInput
              id="register-username-input"
              type="text"
              value={formik.values.username}
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.username")}
              inputProps={{}}
            />
            {formik.touched.username && formik.errors.username && (
              <FormHelperText error id="register-error-username">
                {formik.errors.username}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.email && formik.errors.email)}
          >
            <InputLabel htmlFor="register-email-input">
              {t("form.register.email")}
            </InputLabel>
            <OutlinedInput
              id="register-email-input"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.email")}
              inputProps={{}}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error id="register-error-email">
                {formik.errors.email}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel htmlFor="register-password-input">
              {t("form.register.password")}
            </InputLabel>
            <OutlinedInput
              id="register-password-input"
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
              label={t("form.register.password")}
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error id="register-error-password">
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Typography variant="h6">{t("commun.myorigincountry")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <RegisterCountryBlock
            country={formik.values.country}
            onChange={(value) => formik.setFieldValue(`country`, value)}
            onDelete={() => formik.setFieldValue(`country`, null)}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Typography variant="h6">{t("commun.avatars")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <AvatarLoginSelector
            avatars={avatars}
            avatar={formik.values.avatar}
            onSelect={(value) => formik.setFieldValue(`avatar`, value.id)}
          />
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
            color="secondary"
          >
            {t("form.register.continue")}
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {t("form.register.alreadyaccount")}
          </Typography>
        </Grid>
        <Grid item>
          <Link to="/login">
            <Typography variant="body1" sx={{ textDecoration: "underline" }}>
              {t("form.register.connect")}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};
