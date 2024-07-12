import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "src/form/authentification/ForgotPasswordForm";
import { HeadTitle } from "src/component/HeadTitle";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.forgotpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("form.forgotpassword.forgotpassword")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
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
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "underline" }}
                >
                  {t("form.forgotpassword.connection")}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
