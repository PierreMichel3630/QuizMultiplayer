import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRealtime } from "src/context/NotificationProvider";
import { useRegisterSW } from "virtual:pwa-register/react";
import { UpdateAppButton } from "../button/UpdateAppButton";
import { TitleModal } from "./commun/TitleModal";

interface Props {
  versionMin?: string;
  versionApp: string;
  open: boolean;
  close: () => void;
}

export const VersionModal = ({
  versionMin,
  versionApp,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();
  const { forceCheckUpdate } = useRealtime();
  const [loading, setLoading] = useState(true);

  const {
    needRefresh: [needRefresh],
  } = useRegisterSW();

  const themeMui = useTheme();
  const fullScreen = useMediaQuery(themeMui.breakpoints.down("md"));

  useEffect(() => {
    const refresh = async () => {
      if (open) {
        forceCheckUpdate();
        setLoading(false);
      }
    };
    refresh();
  }, [open]);

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
    >
      <TitleModal title={t("commun.installupdatetitle")} close={close} />
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <Typography>{t("commun.installupdatetext")}</Typography>
          </Grid>
          {versionMin && (
            <Grid size={12}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                <Typography variant="h6">
                  {t("commun.requiredversion")} :
                </Typography>
                <Typography variant="body1" fontSize={15}>
                  {versionMin}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
              <Typography variant="h6">{t("commun.myversion")} :</Typography>
              <Typography variant="body1" fontSize={15}>
                {versionApp}
              </Typography>
            </Box>
          </Grid>
          {loading ? (
            <Grid
              size={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <CircularProgress size={60} />
              <Typography>{t("commun.verifynewversion")}</Typography>
            </Grid>
          ) : (
            <Grid size={12}>
              {needRefresh ? (
                <UpdateAppButton />
              ) : (
                <Alert severity="info">{t("commun.refreshversion")}</Alert>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
