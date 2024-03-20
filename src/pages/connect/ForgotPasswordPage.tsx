import { Card, Container, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { style } from "typestyle";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import logo from "src/assets/logo.png";
import { GoHomeButton } from "src/component/navigation/GoBackButton";
import { ForgotPasswordForm } from "src/form/authentification/ForgotPasswordForm";

const cardCss = style({
  padding: px(8),
});
export const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center" }}>
      <Helmet>
        <title>{`${t("pages.forgotpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Card variant="outlined" className={cardCss}>
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          <Grid item xs={12} sx={{ textAlign: "left" }}>
            <GoHomeButton />
          </Grid>
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
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {t("form.forgotpassword.notforget")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <Link to="/login">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.forgotpassword.connection")}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
