import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConfidentialityPage() {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h1">{t("confidentiality.title")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">
          {t("confidentiality.rules1.title")}
        </Typography>
        <Typography variant="body1">
          {t("confidentiality.rules1.text")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">
          {t("confidentiality.rules2.title")}
        </Typography>
        <Typography variant="body1">
          {t("confidentiality.rules2.text")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">
          {t("confidentiality.rules3.title")}
        </Typography>
        <Typography variant="body1">
          {t("confidentiality.rules3.text")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">
          {t("confidentiality.rules4.title")}
        </Typography>
        <Typography variant="body1">
          {t("confidentiality.rules4.text")}
        </Typography>
      </Grid>
    </Grid>
  );
}
