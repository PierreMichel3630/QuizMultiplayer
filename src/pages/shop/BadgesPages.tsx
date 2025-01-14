import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { BadgeShop } from "src/component/shop/BadgeShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { sortByPriceDesc } from "src/utils/sort";

export default function BadgesPage() {
  const { t } = useTranslation();
  const { badges } = useApp();

  const badgesDisplay = useMemo(
    () => [...badges].sort(sortByPriceDesc),
    [badges]
  );

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        <Helmet>
          <title>{`${t("pages.badges.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <TitleBlock title={t("commun.badges")} />
        </Grid>
        {badgesDisplay.map((badge) => (
          <Grid item key={badge.id}>
            <BadgeShop badge={badge} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
