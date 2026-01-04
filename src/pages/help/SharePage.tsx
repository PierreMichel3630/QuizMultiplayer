import { Box, Container, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { ButtonColor } from "src/component/Button";
import { CopyTextBlock } from "src/component/CopyTextBlock";
import { Colors } from "src/style/Colors";
import { urlGooglePlay, urlPc } from "./InstallationPage";

import googleplay from "src/assets/google-play.png";
import logo from "src/assets/logo.svg";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ShareIcon from "@mui/icons-material/Share";
import { Helmet } from "react-helmet-async";
import { GoBackButtonIcon } from "src/component/navigation/GoBackButton";

export default function SharePage() {
  const { t } = useTranslation();

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
    <Container maxWidth="xs">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.sharefriend.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <GoBackButtonIcon />
              </Grid>
              <Grid item xs sx={{ textAlign: "center" }}>
                <Typography variant="h2">{t("commun.sharefriend")}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant="body1">{t("commun.sharetext")}</Typography>
              </Grid>
              {canBrowserShareData && (
                <Grid item xs={12}>
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
                item
                xs={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt="googleplay"
                  src={googleplay}
                  width="75%"
                  style={{ maxWidth: px(50) }}
                />
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
                <img
                  alt="logo"
                  src={logo}
                  width="75%"
                  style={{ maxWidth: px(50) }}
                />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h4">{t("commun.computer")}</Typography>
                <CopyTextBlock text={urlPc} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
