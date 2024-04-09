import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import logo from "src/assets/logo.png";
import { ForgotPasswordForm } from "src/form/authentification/ForgotPasswordForm";
export const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.forgotpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1} sx={{ textAlign: "center" }}>
        <Grid item xs={12}>
          <Link to="/">
            <img src={logo} width={100} />
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">
            {t("form.forgotpassword.forgotpassword")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="body1">
            {t("form.forgotpassword.modality")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ForgotPasswordForm />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ justifyContent: "center", display: "flex", gap: 1 }}
        >
          <Typography variant="body1">
            {t("form.forgotpassword.notforget")}
          </Typography>
          <Link to="/login">
            <Typography variant="body1" sx={{ textDecoration: "underline" }}>
              {t("form.forgotpassword.connection")}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
