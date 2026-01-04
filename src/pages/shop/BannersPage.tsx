import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectBanners } from "src/api/banner";
import { BannerShop } from "src/component/shop/BannerShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { Banner } from "src/models/Banner";
import { sortByPriceDesc } from "src/utils/sort";

export default function BannersPage() {
  const { t } = useTranslation();
  const { mybanners } = useApp();

  const [banners, setBanners] = useState<Array<Banner>>([]);

  useEffect(() => {
    const getBanners = () => {
      selectBanners().then(({ data }) => {
        const value = data !== null ? (data as Array<Banner>) : [];
        setBanners(value);
      });
    };
    getBanners();
  }, []);

  const bannersDisplay = useMemo(() => {
    const idsBuy = mybanners.map((el) => el.id);
    return [...banners]
      .filter((el) => el.price > 0 && !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [banners, mybanners]);

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
            <BannerShop banner={banner} height={100} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
