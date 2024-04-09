import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ResetPasswordForm } from "src/form/authentification/ResetPasswordForm";

import { Helmet } from "react-helmet-async";
import logo from "src/assets/logo.png";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.resetpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1} sx={{ textAlign: "center" }}>
        <Grid item xs={12}>
          <Link to="/">
            <img src={logo} width={100} />
          </Link>
        </Grid>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h2">
            {t("form.resetpassword.resetpassword")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ResetPasswordForm />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", gap: 1, justifyContent: "center" }}
        >
          <Typography variant="body1">
            {t("form.register.alreadyaccount")}
          </Typography>
          <Link to="/login">
            <Typography variant="body1" sx={{ textDecoration: "underline" }}>
              {t("form.register.connect")}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
