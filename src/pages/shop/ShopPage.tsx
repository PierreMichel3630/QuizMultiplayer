import { Box, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CountBlock } from "src/component/CountBlock";
import { AvatarShopBlock } from "src/component/shop/AvatarShop";
import { BadgeShopBlock } from "src/component/shop/BadgeShop";
import { BannerShopBlock } from "src/component/shop/BannerShop";
import { TitleShopBlock } from "src/component/shop/TitleShop";
import { useApp } from "src/context/AppProvider";

export default function ShopPage() {
  const { t } = useTranslation();

  const { avatars, badges, titles, banners } = useApp();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Helmet>
          <title>{`${t("pages.shop.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.avatars")}
            count={avatars.length}
            link="/avatars"
          >
            <AvatarShopBlock />
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.badges")}
            count={badges.length}
            link="/badges"
          >
            <BadgeShopBlock />
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.banners")}
            count={banners.length}
            link="/banners"
          >
            <BannerShopBlock />
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.titles")}
            count={titles.length}
            link="/titles"
          >
            <TitleShopBlock />
          </CountBlock>
        </Grid>
      </Grid>
    </Box>
  );
}
