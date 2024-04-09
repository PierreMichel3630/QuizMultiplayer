import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { RuleBlock } from "src/component/RuleBlock";

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: percent(100), p: 1 }}>
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 2 }}>
        <Helmet>
          <title>{`${t("pages.home.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1">{t("appname")}</Typography>
          <Typography variant="h4">{t("description")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <RuleBlock />
        </Grid>
      </Grid>
    </Box>
  );
};
