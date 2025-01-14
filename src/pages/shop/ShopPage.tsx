import { Box, Grid } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectAvatar } from "src/api/avatar";
import { selectBadges } from "src/api/badge";
import { selectBanners } from "src/api/banner";
import { selectTitles } from "src/api/title";
import { CountBlock } from "src/component/CountBlock";
import { AvatarShopBlock } from "src/component/shop/AvatarShop";
import { BadgeShopBlock } from "src/component/shop/BadgeShop";
import { BannerShopBlock } from "src/component/shop/BannerShop";
import { TitleShopBlock } from "src/component/shop/TitleShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { Avatar } from "src/models/Avatar";
import { Badge } from "src/models/Badge";
import { Banner } from "src/models/Banner";
import { Title } from "src/models/Title";
import { sortByPriceDesc } from "src/utils/sort";

export default function ShopPage() {
  const { t } = useTranslation();
  const { myAvatars, myBadges, mybanners, myTitles } = useApp();

  const [avatars, setAvatars] = useState<Array<Avatar>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [banners, setBanners] = useState<Array<Banner>>([]);
  const [titles, setTitles] = useState<Array<Title>>([]);

  useEffect(() => {
    const getAvatars = () => {
      selectAvatar().then(({ data }) => {
        const value = data !== null ? (data as Array<Avatar>) : [];
        setAvatars(value);
      });
    };
    const getBadges = () => {
      selectBadges().then(({ data }) => {
        const value = data !== null ? (data as Array<Badge>) : [];
        setBadges(value);
      });
    };
    const getBanners = () => {
      selectBanners().then(({ data }) => {
        const value = data !== null ? (data as Array<Banner>) : [];
        setBanners(value);
      });
    };
    const getTitles = () => {
      selectTitles().then(({ data }) => {
        const value = data !== null ? (data as Array<Title>) : [];
        setTitles(value);
      });
    };
    getTitles();
    getBanners();
    getBadges();
    getAvatars();
  }, []);

  const avatarsDisplay = useMemo(() => {
    const idsBuy = myAvatars.map((el) => el.id);
    return [...avatars]
      .filter((el) => el.price > 0 && !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [avatars, myAvatars]);

  const titlesDisplay = useMemo(() => {
    const idsBuy = myTitles.map((el) => el.id);
    return [...titles]
      .filter((el) => !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [titles, myTitles]);

  const bannersDisplay = useMemo(() => {
    const idsBuy = mybanners.map((el) => el.id);
    return [...banners]
      .filter((el) => el.price > 0 && !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [banners, mybanners]);

  const badgesDisplay = useMemo(() => {
    const idsBuy = myBadges.map((el) => el.id);
    return [...badges]
      .filter((el) => !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [badges, myBadges]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Helmet>
          <title>{`${t("pages.shop.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <TitleBlock title={t("commun.shop")} />
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.avatars")}
            count={avatarsDisplay.length}
            link="/avatars"
          >
            <AvatarShopBlock avatars={avatarsDisplay} />
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.badges")}
            count={badgesDisplay.length}
            link="/badges"
          >
            <BadgeShopBlock badges={badgesDisplay} />
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.banners")}
            count={bannersDisplay.length}
            link="/banners"
          >
            <BannerShopBlock banners={bannersDisplay} />
          </CountBlock>
        </Grid>
        <Grid item xs={12}>
          <CountBlock
            title={t("commun.titles")}
            count={titlesDisplay.length}
            link="/titles"
          >
            <TitleShopBlock titles={titlesDisplay} />
          </CountBlock>
        </Grid>
      </Grid>
    </Box>
  );
}
