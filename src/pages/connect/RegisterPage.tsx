import { Box, Card, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { style } from "typestyle";

import { RegisterForm } from "src/form/authentification/RegisterForm";

import { Helmet } from "react-helmet-async";
import logo from "src/assets/logo.png";
import { GoHomeButton } from "src/component/navigation/GoBackButton";

const cardCss = style({
  padding: px(8),
});
export const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Helmet>
        <title>{`${t("pages.register.title")} - ${t("appname")}`}</title>
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
            <Typography variant="h4">
              {t("form.register.createaccountemail")}
            </Typography>
          </Grid>
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
