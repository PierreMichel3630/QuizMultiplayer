import {
  AppBar,
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
import ShareIcon from "@mui/icons-material/Share";
import { important, px } from "csx";
import { useMemo } from "react";
import googleplay from "src/assets/google-play.png";
import logo from "src/assets/logo.svg";
import { urlGooglePlay, urlPc } from "src/pages/help/InstallationPage";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { CopyTextBlock } from "../CopyTextBlock";

interface Props {
  open: boolean;
  close: () => void;
}

export const ShareModal = ({ open, close }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const data = useMemo(
    () => ({
      title: t("share.title"),
      text: t("share.text"),
      url: urlPc,
    }),
    [t]
  );

  const canBrowserShareData = useMemo(() => {
    if (!navigator.share || !navigator.canShare) {
      return false;
    }

    return navigator.canShare(data);
  }, [data]);

  const shareApplication = async () => {
    try {
      await navigator.share(data);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  };

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar sx={{ minHeight: important("auto") }}>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.share")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 2, pt: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid sx={{ mb: 2 }} size={12}>
            <Typography variant="body1">{t("commun.sharetext")}</Typography>
          </Grid>
          {canBrowserShareData && (
            <Grid size={12}>
              <ButtonColor
                typography="h6"
                iconSize={20}
                value={Colors.colorApp}
                label={t("commun.shareapplication")}
                icon={ShareIcon}
                variant="contained"
                onClick={shareApplication}
              />
            </Grid>
          )}
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            size={2}>
            <img
              alt="google play icon"
              src={googleplay}
              width="75%"
              style={{ maxWidth: px(50) }}
            />
          </Grid>
          <Grid size={10}>
            <Typography variant="h4">{t("commun.googleplay")}</Typography>
            <CopyTextBlock text={urlGooglePlay} />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            size={2}>
            <img
              alt="share icon"
              src={logo}
              width="75%"
              style={{ maxWidth: px(50) }}
            />
          </Grid>
          <Grid size={10}>
            <Typography variant="h4">{t("commun.computer")}</Typography>
            <CopyTextBlock text={urlPc} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
