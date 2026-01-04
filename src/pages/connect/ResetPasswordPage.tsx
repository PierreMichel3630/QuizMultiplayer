import { Alert, Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ResetPasswordForm } from "src/form/authentification/ResetPasswordForm";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ButtonColor } from "src/component/Button";
import { Colors } from "src/style/Colors";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const navigate = useNavigate();

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const params = hash.replace("#", "").split("&");
    let data = { error: null };
    params.forEach((param) => {
      const propname = param.split("=");
      data = { ...data, [propname[0]]: propname[1] };
    });
    setIsError(data.error !== null ? true : false);
  }, [hash]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.resetpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {isError ? (
              <>
                <Grid sx={{ mt: 2 }} size={12}>
                  <Alert severity="error">{t("commun.error")}</Alert>
                </Grid>
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.blue}
                    label={t("commun.return")}
                    icon={KeyboardReturnIcon}
                    onClick={() => {
                      navigate(`/forgotpassword`);
                    }}
                    variant="contained"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid sx={{ mt: 2 }} size={12}>
                  <Typography variant="body1">
                    {t("form.resetpassword.resetpasswordexplain")}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <ResetPasswordForm />
                </Grid>
                <Grid sx={{ display: "flex", gap: 1, justifyContent: "center" }} size={12}>
                  <Typography variant="body1">
                    {t("form.register.alreadyaccount")}
                  </Typography>
                  <Link to="/login">
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: "underline" }}
                    >
                      {t("form.register.connect")}
                    </Typography>
                  </Link>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
