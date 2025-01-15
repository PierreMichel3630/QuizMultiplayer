import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { selectShopItemByTheme } from "src/api/shop";
import { ItemShop } from "src/component/shop/ItemShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { ShopType } from "src/models/enum/ShopType";
import { ShopItem } from "src/models/Shop";
import { sortByPriceDesc } from "src/utils/sort";

export default function ShopThemePage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { myTitles, myAvatars, myBadges, mybanners } = useApp();

  const [items, setItems] = useState<Array<ShopItem>>([]);

  useEffect(() => {
    const getItems = () => {
      if (id) {
        selectShopItemByTheme(Number(id)).then(({ data }) => {
          setItems(data ?? []);
        });
      }
    };
    getItems();
  }, [id]);

  const itemsDisplay = useMemo(() => {
    return [...items]
      .filter((el) => el.price > 0 || el.isaccomplishment)
      .filter((el) => {
        const isAvatar =
          el.type === ShopType.AVATAR && myAvatars.find((a) => a.id === el.id);
        const isBadge =
          el.type === ShopType.BADGE && myBadges.find((a) => a.id === el.id);
        const isBanner =
          el.type === ShopType.BANNER && mybanners.find((a) => a.id === el.id);
        const isTitle =
          el.type === ShopType.TITLE && myTitles.find((a) => a.id === el.id);

        return !(isAvatar || isBadge || isBanner || isTitle);
      })
      .sort(sortByPriceDesc);
  }, [items, myTitles, myAvatars, myBadges, mybanners]);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Helmet>
          <title>{`${t("pages.titles.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <TitleBlock title={t("commun.titles")} />
        </Grid>
        {itemsDisplay.map((item, index) => (
          <Grid item key={index}>
            <ItemShop item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
