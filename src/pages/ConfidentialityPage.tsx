import { Box, Grid, Typography } from "@mui/material";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

export default function ConfidentialityPage() {
  const { t } = useTranslation();

  const chartes = [
    {
      title: t("confidentiality.charte.title"),
      rules: [
        "confidentiality.charte.rules1",
        "confidentiality.charte.rules2",
        "confidentiality.charte.rules3",
        "confidentiality.charte.rules4",
        "confidentiality.charte.rules5",
      ],
    },
    {
      title: t("confidentiality.mentionslegales.title"),
      rules: [
        "confidentiality.mentionslegales.rules1",
        "confidentiality.mentionslegales.rules2",
        "confidentiality.mentionslegales.rules3",
        "confidentiality.mentionslegales.rules4",
        "confidentiality.mentionslegales.rules5",
      ],
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1">{t("confidentiality.title")}</Typography>
        </Grid>
        {chartes.map((el, index) => (
          <Fragment key={index}>
            <Grid item xs={12}>
              <Typography variant="h2">{el.title}</Typography>
            </Grid>
            {el.rules.map((rule, i) => (
              <Fragment key={i}>
                <Grid item xs={12}>
                  <Typography variant="h4">{t(`${rule}.title`)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{t(`${rule}.text`)}</Typography>
                </Grid>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
}
