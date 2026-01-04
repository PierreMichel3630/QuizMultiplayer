import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { countPlayersSameUsername, updateSelectProfil } from "src/api/profile";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { Profile } from "src/models/Profile";
import * as Yup from "yup";

import { useFormik } from "formik";
import { useMemo } from "react";
import DoneIcon from "@mui/icons-material/Done";

export const UsernameInput = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const { user, profile, setProfile } = useAuth();

  const initialValue: {
    username: string;
  } = useMemo(
    () => ({
      username: profile ? profile.username : "",
    }),
    [profile]
  );

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t("form.register.requiredusername"))
      .min(3, t("form.register.minusername"))
      .max(155, t("form.register.maxusername"))
      .test(
        "checkDuplicateUsername",
        t("form.register.duplicateusername"),
        (value) => {
          return new Promise((resolve) => {
            if (profile?.username !== value) {
              countPlayersSameUsername(value).then(({ count }) => {
                resolve(count === 0);
              });
            } else {
              resolve(true);
            }
          });
        }
      )
      .test("noSpace", t("form.register.nospaceusername"), (value) => {
        const trimValue = value.replace(/\s+/g, "");
        const isSpace = trimValue.length === value.length;
        return isSpace;
      }),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (user) {
          const newProfil = { id: user.id, ...values };
          const { data, error } = await updateSelectProfil(newProfil);
          if (error) {
            setSeverity("error");
            setMessage(t("commun.error"));
          } else {
            setSeverity("success");
            setMessage(t("alert.updateusernamesuccess"));
            setProfile(data as Profile);
          }
        } else {
          setSeverity("error");
          setMessage(t("commun.error"));
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  const isModified = useMemo(
    () => profile?.username !== formik.values.username,
    [profile, formik]
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl fullWidth error={Boolean(formik.errors.username)}>
        <Grid container spacing={1} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Typography variant="h4">{t("commun.username")}</Typography>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 8
            }}>
            <OutlinedInput
              id="register-username-input"
              type="text"
              value={formik.values.username}
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              inputProps={{}}
              fullWidth
              size="small"
            />
            {formik.errors.username && (
              <FormHelperText error id="register-error-username">
                {formik.errors.username}
              </FormHelperText>
            )}
          </Grid>
          {Object.keys(formik.errors).length === 0 && isModified && (
            <Grid size={12}>
              <Button
                disableElevation
                type="submit"
                fullWidth
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<DoneIcon />}
              >
                {t("commun.validate")}
              </Button>
            </Grid>
          )}
        </Grid>
      </FormControl>
    </form>
  );
};
