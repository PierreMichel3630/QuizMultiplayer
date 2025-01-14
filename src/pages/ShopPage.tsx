import { Box, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CountBlock } from "src/component/CountBlock";
import { AvatarShop } from "src/component/shop/AvatarShop";
import { BadgeShop } from "src/component/shop/BadgeShop";
import { BannerShop } from "src/component/shop/BannerShop";
import { useApp } from "src/context/AppProvider";

export const ShopPage = () => {
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
            <Box sx={{ display: "flex", gap: 1 }}>
              {avatars.map((avatar) => (
                <AvatarShop key={avatar.id} avatar={avatar} />
              ))}
            </Box>
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.badges")}
            count={badges.length}
            link="/badges"
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {badges.map((badge) => (
                <BadgeShop key={badge.id} badge={badge} />
              ))}
            </Box>
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.banners")}
            count={banners.length}
            link="/banners"
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {banners.map((banner) => (
                <BannerShop key={banner.id} banner={banner} />
              ))}
            </Box>
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.titles")}
            count={titles.length}
            link="/titles"
          >
            <Typography variant="h6" noWrap>
              {t("commun.seeall")}
            </Typography>
          </CountBlock>
        </Grid>
      </Grid>
    </Box>
  );
};
