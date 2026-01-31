import { Box, Container, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { ButtonColor } from "src/component/Button";
import { CopyTextBlock } from "src/component/CopyTextBlock";
import { Colors } from "src/style/Colors";

import googleplay from "src/assets/google-play.png";
import logo from "src/assets/logo.svg";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ShareIcon from "@mui/icons-material/Share";
import { Helmet } from "react-helmet-async";
import { GoBackButtonIcon } from "src/component/navigation/GoBackButton";
import { urlGooglePlay, urlPc } from "src/utils/config";

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
        <Grid size={12}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={1} alignItems="center">
              <Grid>
                <GoBackButtonIcon />
              </Grid>
              <Grid sx={{ textAlign: "center" }} size="grow">
                <Typography variant="h2">{t("commun.sharefriend")}</Typography>
              </Grid>
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
                size={2}
              >
                <img
                  alt="googleplay"
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
                size={2}
              >
                <img
                  alt="logo"
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
