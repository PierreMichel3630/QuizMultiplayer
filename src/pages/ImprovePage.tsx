import { Box, Button, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "src/icons/DiscordIcon";

export default function ImprovePage() {
  const { t } = useTranslation();

  const urlDiscord = "https://discord.gg/zyuruK2nBJ";
  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.improve.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ width: percent(100), p: 1, mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="body1">{t("commun.improvetext")}</Typography>
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
      </Grid>
    </Grid>
  );
}
