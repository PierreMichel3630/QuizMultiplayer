import { Box, Card, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { style } from "typestyle";

import { ResetPasswordForm } from "src/form/authentification/ResetPasswordForm";

import { Helmet } from "react-helmet-async";
import logo from "src/assets/logo.png";
import { px } from "csx";

const cardCss = style({
  padding: px(8),
});
export const ResetPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Helmet>
        <title>{`${t("pages.resetpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Card variant="outlined" className={cardCss}>
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
      </Card>
    </Box>
  );
};
