import { Box, Divider, Grid, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { HeadTitle } from "src/component/HeadTitle";
import { px } from "csx";
import { StepBlock } from "src/component/StepBlock";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";

import googleplay from "src/assets/google-play.png";

export default function InstallationPage() {
  const { t } = useTranslation();

  const urlGooglePlay =
    "https://play.google.com/store/apps/details?id=app.web.quizup_v2.twa&hl=fr";
  const urlPc = "https://quizbattle.fr";

  return (
    <Grid container>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.installation.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h4">{t("installation.android")}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="body1">
                {t("installation.android2")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
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
                  }}
                >
                  <img src={googleplay} style={{ width: px(25) }} />
                  <Typography variant="h6" color="text.secondary">
                    {t("installation.android1")}
                  </Typography>
                </Box>
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ borderBottomWidth: 5 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{t("installation.apple")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <StepBlock
                number={1}
                label={
                  <Typography variant="body1" color="text.secondary">
                    {t("installation.apple1")}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <StepBlock
                number={2}
                label={
                  <Typography variant="body1" color="text.secondary">
                    {t("installation.apple2")}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <StepBlock
                number={3}
                label={
                  <Typography variant="body1" color="text.secondary">
                    {t("installation.apple3")}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ borderBottomWidth: 5 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{t("installation.computer")}</Typography>
            </Grid>
            <Grid item xs={12}>
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
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
