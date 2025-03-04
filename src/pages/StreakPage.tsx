import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { StreakBlock, StreakRecompense } from "src/component/StreakBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeRecompense } from "src/models/enum/TypeRecompense";

export default function StreakPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const recompenses = [
    { day: 1, type: TypeRecompense.GOLD, value: 50 },
    { day: 2, type: TypeRecompense.XP, value: 200 },
    { day: 3, type: TypeRecompense.GOLD, value: 100 },
    { day: 4, type: TypeRecompense.XP, value: 1000 },
    { day: 5, type: TypeRecompense.GOLD, value: 500 },
    { day: 6, type: TypeRecompense.XP, value: 2000 },
    { day: 7, type: TypeRecompense.GOLD, value: 1000 },
    { day: 8, type: TypeRecompense.XP, value: 5000 },
    { day: 9, type: TypeRecompense.GOLD, value: 1500 },
    { day: 10, type: TypeRecompense.GOLD, value: 5000 },
  ];

  const streak = useMemo(() => (profile ? profile.loginstreak : 0), [profile]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.streak.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
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
            {recompenses.map((recompense, index) => (
              <Grid item xs={4} key={index}>
                <StreakRecompense
                  day={recompense.day}
                  type={recompense.type}
                  value={recompense.value}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
