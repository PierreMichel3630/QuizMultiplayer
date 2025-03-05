import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { StreakBlock, StreakRecompense } from "src/component/StreakBlock";
import { RECOMPENSES_LOGIN_STREAK } from "src/configuration/configuration";
import { useAuth } from "src/context/AuthProviderSupabase";

export default function StreakPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const streak = useMemo(() => (profile ? profile.loginstreak : 0), [profile]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.streak.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <StreakBlock value={streak} logoSize={50} textSize={45} />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h6">
                {t("commun.loginstreakexplain")}
              </Typography>
            </Grid>
            {RECOMPENSES_LOGIN_STREAK.map((recompense, index, { length }) => {
              const nbRecompenses = recompense.recompenses.length;
              const isLast = index + 1 === length;
              return (
                <Grid
                  item
                  xs={4 * nbRecompenses}
                  sm={3 * nbRecompenses}
                  md={2 * nbRecompenses}
                  key={index}
                >
                  <StreakRecompense
                    recompense={recompense}
                    streak={streak}
                    isLast={isLast}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
