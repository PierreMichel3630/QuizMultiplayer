import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import WifiOffIcon from "@mui/icons-material/WifiOff";

export const OfflineBlock = () => {
  const { t } = useTranslation();
  return (
    <Grid
      container
      spacing={1}
      sx={{ textAlign: "center", height: "calc(100vh - 120px)" }}
      justifyContent="center"
      alignContent="center"
    >
      <Grid item>
        <WifiOffIcon sx={{ fontSize: 180 }} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">{t("offline.title")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">{t("offline.text")}</Typography>
      </Grid>
    </Grid>
  );
};
