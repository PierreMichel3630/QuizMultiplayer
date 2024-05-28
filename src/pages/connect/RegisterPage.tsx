import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { RegisterForm } from "src/form/authentification/RegisterForm";

import { Helmet } from "react-helmet-async";
import { HeadTitle } from "src/component/HeadTitle";

export const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.register.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("form.register.createaccount")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <RegisterForm />
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
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "underline" }}
                >
                  {t("form.register.connect")}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
