import { Box, Card, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { style } from "typestyle";

import { LoginForm } from "src/form/authentification/LoginForm";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import logo from "src/assets/logo.png";
import { GoHomeButton } from "src/component/navigation/GoBackButton";

const cardCss = style({
  padding: px(8),
});
export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Helmet>
        <title>{`${t("pages.login.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Card variant="outlined" className={cardCss}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <GoHomeButton />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Link to="/">
              <img src={logo} width={100} />
            </Link>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h3">{t("form.login.connectmail")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <LoginForm />
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {t("form.login.haveaccount")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <Link to="/register">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.login.createaccount")}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
