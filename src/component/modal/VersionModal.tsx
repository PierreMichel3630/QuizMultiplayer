import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { UpdateAppButton } from "../button/UpdateAppButton";

interface Props {
  versionMin: string;
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
  const themeMui = useTheme();
  const fullScreen = useMediaQuery(themeMui.breakpoints.down("md"));

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.installupdatetitle")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <Typography>{t("commun.installupdatetext")}</Typography>
          </Grid>
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
          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
              <Typography variant="h6">{t("commun.myversion")} :</Typography>
              <Typography variant="body1" fontSize={15}>
                {versionApp}
              </Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            <UpdateAppButton onUpdate={() => close()} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
