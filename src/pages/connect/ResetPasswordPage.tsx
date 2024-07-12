import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ResetPasswordForm } from "src/form/authentification/ResetPasswordForm";

import { Helmet } from "react-helmet-async";
import { HeadTitle } from "src/component/HeadTitle";

export default function ResetPasswordPage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.resetpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <HeadTitle title={t("form.resetpassword.resetpassword")} />
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
}
