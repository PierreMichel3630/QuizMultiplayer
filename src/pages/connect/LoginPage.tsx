import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { LoginForm } from "src/form/authentification/LoginForm";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import logo from "src/assets/logo.png";

export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.login.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Link to="/">
            <img src={logo} width={100} />
          </Link>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("form.login.connectmail")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <LoginForm />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ justifyContent: "center", display: "flex", gap: 1 }}
        >
          <Typography variant="body1">{t("form.login.haveaccount")}</Typography>
          <Link to="/register">
            <Typography variant="body1" sx={{ textDecoration: "underline" }}>
              {t("form.login.createaccount")}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
