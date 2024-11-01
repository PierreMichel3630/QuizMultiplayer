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
import { important, px } from "csx";
import googleplay from "src/assets/google-play.png";
import logo from "src/assets/logo.svg";
import { urlGooglePlay, urlPc } from "src/pages/help/InstallationPage";
import { Colors } from "src/style/Colors";
import { CopyTextBlock } from "../CopyTextBlock";

interface Props {
  open: boolean;
  close: () => void;
}

export const ShareModal = ({ open, close }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
      <DialogContent sx={{ backgroundColor: Colors.black, p: 2, pt: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Typography variant="body1">{t("commun.sharetext")}</Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={googleplay} width="75%" style={{ maxWidth: px(50) }} />
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h4">{t("commun.googleplay")}</Typography>
            <CopyTextBlock text={urlGooglePlay} />
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={logo} width="75%" style={{ maxWidth: px(50) }} />
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h4">{t("commun.computer")}</Typography>
            <CopyTextBlock text={urlPc} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
