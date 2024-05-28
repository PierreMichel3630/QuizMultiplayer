import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { HeadTitle } from "src/component/HeadTitle";

import { percent } from "csx";
import img1 from "src/assets/installation/installation1.jpg";
import img3 from "src/assets/installation/installation3.jpg";
import { StepBlock } from "src/component/StepBlock";

import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { DefaultTabs } from "src/component/Tabs";

export const InstallationPage = () => {
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const tabs = [
    { label: t("commun.android"), icon: <AndroidIcon /> },
    { label: t("commun.apple"), icon: <AppleIcon /> },
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.installation.title")} />
      </Grid>
      <Grid item xs={12}>
        <DefaultTabs values={tabs} tab={tab} onChange={setTab} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {tab === 0 ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("commun.solution1")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <img src={img1} style={{ maxWidth: percent(100) }} />
                </Grid>
                <Grid item xs={12}>
                  <StepBlock
                    number={1}
                    label={
                      <Typography variant="body1" color="text.secondary">
                        {t("installation.android1")}
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6">{t("commun.solution2")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <img src={img3} style={{ maxWidth: percent(100) }} />
                </Grid>
                <Grid item xs={12}>
                  <StepBlock
                    number={1}
                    label={
                      <Box>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          component="span"
                        >
                          {t("commun.clickon")}
                        </Typography>
                        <MoreVertIcon
                          sx={{ color: "white", verticalAlign: "bottom" }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          component="span"
                        >
                          {t("installation.android2")}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <StepBlock
                    number={2}
                    label={
                      <Box>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          component="span"
                        >
                          {t("installation.android3")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          component="span"
                        >
                          {t("commun.clickon")}
                        </Typography>
                        <InstallMobileIcon
                          sx={{ color: "white", verticalAlign: "bottom" }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          component="span"
                        >
                          {t("commun.installapplication")}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              </>
            ) : (
              <>
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
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
