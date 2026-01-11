import { Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StepBlock } from "src/component/StepBlock";
import { Colors } from "src/style/Colors";

import googleplay from "src/assets/google-play.png";
import apple1 from "src/assets/installation/apple1.png";
import apple2 from "src/assets/installation/apple2.png";
import apple3 from "src/assets/installation/apple3.png";
import apple4 from "src/assets/installation/apple4.png";
import { Helmet } from "react-helmet-async";
import { PageBarNavigation } from "src/component/page/PageBarNavigation";
import { urlGooglePlay, urlPc } from "src/utils/config";

export default function InstallationPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t("pages.installation.title")} - ${t("appname")}`}</title>
      </Helmet>
      <PageBarNavigation title={t("pages.installation.title")}>
        <Grid container spacing={2} justifyContent="center" sx={{ p: 1 }}>
          <Grid size={12}>
            <Typography variant="h4">{t("installation.computer")}</Typography>
          </Grid>
          <Grid size={12}>
            <StepBlock
              number={1}
              label={
                <Typography variant="body1" color="text.secondary">
                  <Trans
                    i18nKey={t("installation.computer1")}
                    values={{ link: urlPc }}
                    components={{ anchor: <Link to={urlPc} /> }}
                    style={{ color: "white" }}
                  />
                </Typography>
              }
            />
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Typography variant="h4">{t("installation.android")}</Typography>
          </Grid>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="body1">
              {t("installation.android2")}
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            size={12}
          >
            <Link
              to={urlGooglePlay}
              style={{
                textDecoration: "inherit",
              }}
            >
              <Box
                sx={{
                  borderRadius: px(5),
                  p: 1,
                  backgroundColor: Colors.black,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  border: "1px solid white",
                }}
              >
                <img
                  alt="explain installation"
                  src={googleplay}
                  style={{ width: px(25) }}
                />
                <Typography variant="h6" color="text.secondary">
                  {t("installation.android1")}
                </Typography>
              </Box>
            </Link>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Typography variant="h4">{t("installation.apple")}</Typography>
          </Grid>
          <Grid size={12}>
            <StepBlock
              number={1}
              label={
                <Typography variant="body1" color="text.secondary">
                  {t("installation.apple1")}
                </Typography>
              }
            />
          </Grid>
          <Grid>
            <img
              alt="explain installation"
              src={apple3}
              style={{ maxWidth: px(300) }}
            />
          </Grid>
          <Grid size={12}>
            <StepBlock
              number={2}
              label={
                <Typography variant="body1" color="text.secondary">
                  {t("installation.apple2")}
                </Typography>
              }
            />
          </Grid>
          <Grid>
            <img
              alt="explain installation"
              src={apple2}
              style={{ maxWidth: px(300) }}
            />
          </Grid>
          <Grid size={12}>
            <StepBlock
              number={3}
              label={
                <Typography variant="body1" color="text.secondary">
                  {t("installation.apple3")}
                </Typography>
              }
            />
          </Grid>
          <Grid>
            <img
              alt="explain installation"
              src={apple1}
              style={{ maxWidth: px(300) }}
            />
          </Grid>
          <Grid>
            <img
              alt="explain installation"
              src={apple4}
              style={{ maxWidth: px(300) }}
            />
          </Grid>
        </Grid>
      </PageBarNavigation>
    </>
  );
}
