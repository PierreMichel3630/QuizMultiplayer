import { Box, Button, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "src/icons/DiscordIcon";

export const DiscordPage = () => {
  const { t } = useTranslation();

  const urlDiscord = "https://discord.gg/zyuruK2nBJ";
  return (
    <Box sx={{ width: percent(100), p: 1, mt: 2 }}>
      <Helmet>
        <title>{`${t("pages.report.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1" sx={{ fontSize: 25 }}>
            {t("commun.reportpropose")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="body1">
            {t("commun.signalproblemtext")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            color="success"
            startIcon={<DiscordIcon />}
            onClick={() => window.open(urlDiscord, "_blank", "noreferrer")}
          >
            <Typography variant="h6">{t("commun.joindiscord")}</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
