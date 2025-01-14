import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectBadges } from "src/api/badge";
import { BadgeShop } from "src/component/shop/BadgeShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { Badge } from "src/models/Badge";
import { sortByPriceDesc } from "src/utils/sort";

export default function BadgesPage() {
  const { t } = useTranslation();
  const { myBadges } = useApp();

  const [badges, setBadges] = useState<Array<Badge>>([]);

  useEffect(() => {
    const getBadges = () => {
      selectBadges().then(({ data }) => {
        const value = data !== null ? (data as Array<Badge>) : [];
        setBadges(value);
      });
    };
    getBadges();
  }, []);

  const badgesDisplay = useMemo(() => {
    const idsBuy = myBadges.map((el) => el.id);
    return [...badges]
      .filter((el) => !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [badges, myBadges]);

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
