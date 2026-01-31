import { Box, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ChallengeButton } from "src/component/button/ChallengeButton";
import { StreakBlock, StreakRecompense } from "src/component/StreakBlock";
import { RECOMPENSES_STREAK } from "src/configuration/configuration";
import { useAuth } from "src/context/AuthProviderSupabase";

export default function StreakPage() {
  const { t } = useTranslation();
  const { streak } = useAuth();

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.streak.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <StreakBlock value={streak ?? 0} logoSize={50} textSize={45} />
              </Box>
            </Grid>
            <Grid sx={{ textAlign: "center" }} size={12}>
              <Typography variant="h6">{t("commun.streakexplain")}</Typography>
            </Grid>
            <Grid size={12}>
              <ChallengeButton />
            </Grid>
            {RECOMPENSES_STREAK.map((recompense, index, { length }) => {
              const nbRecompenses = recompense.recompenses.length;
              const isLast = index + 1 === length;
              return (
                <Grid
                  key={index}
                  size={{
                    xs: 4 * nbRecompenses,
                    sm: 3 * nbRecompenses,
                    md: 2 * nbRecompenses
                  }}>
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
