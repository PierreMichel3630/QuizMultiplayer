import { useEffect, useMemo, useState } from "react";
import { selectShopItemByTheme } from "src/api/shop";
import { ShopItem } from "src/models/Shop";
import { ThemeShop } from "src/models/Theme";
import { CountBlock } from "../CountBlock";
import { ItemsShopBlock } from "../shop/ItemShop";
import { useApp } from "src/context/AppProvider";
import { ShopType } from "src/models/enum/ShopType";
import { sortByPriceDesc } from "src/utils/sort";

interface Props {
  theme: ThemeShop;
}

export const ThemeShopBlock = ({ theme }: Props) => {
  const { myTitles, myAvatars, myBadges, mybanners } = useApp();

  const [items, setItems] = useState<Array<ShopItem>>([]);

  useEffect(() => {
    const getItems = () => {
      selectShopItemByTheme(theme.id).then(({ data }) => {
        setItems(data ?? []);
      });
    };
    getItems();
  }, [theme]);

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
    itemsDisplay.length > 0 && (
      <CountBlock
        title={theme.name}
        count={itemsDisplay.length}
        link={`/theme/${theme.id}/shop`}
      >
        <ItemsShopBlock items={itemsDisplay} />
      </CountBlock>
    )
  );
};
