import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { BannerShop } from "src/component/shop/BannerShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { sortByPriceDesc } from "src/utils/sort";

export default function BannersPage() {
  const { t } = useTranslation();
  const { banners } = useApp();

  const bannersDisplay = useMemo(
    () => [...banners].filter((el) => el.price > 0).sort(sortByPriceDesc),
    [banners]
  );

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        <Helmet>
          <title>{`${t("pages.banners.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <TitleBlock title={t("commun.banners")} />
        </Grid>
        {bannersDisplay.map((banner) => (
          <Grid item xs={6} sm={4} md={3} key={banner.id}>
            <BannerShop banner={banner} height={150} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
