import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { LoginForm } from "src/form/authentification/LoginForm";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { HeadTitle } from "src/component/HeadTitle";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.login.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("form.login.connect")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12}>
              <LoginForm />
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {t("form.login.haveaccount")}
              </Typography>
            </Grid>
            <Grid item>
              <Link to="/register">
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "underline" }}
                >
                  {t("form.login.createaccount")}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
