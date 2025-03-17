import { Avatar } from "src/models/Avatar";
import { Badge } from "src/models/Badge";
import { Banner } from "src/models/Banner";
import { ShopItem } from "src/models/Shop";
import { Title } from "src/models/Title";
import { AvatarShop } from "./AvatarShop";
import { BadgeShop } from "./BadgeShop";
import { BannerShop } from "./BannerShop";
import { TitleShop } from "./TitleShop";
import { useBreakpoint } from "src/utils/mediaQuery";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { SkeletonAvatars } from "../skeleton/SkeletonShop";

interface PropsItemsShopBlock {
  items: Array<ShopItem>;
}
export const ItemsShopBlock = ({ items }: PropsItemsShopBlock) => {
  const breakpoint = useBreakpoint();

  const ref = useRef<HTMLDivElement | null>(null);
  const [maxIndex, setMaxIndex] = useState(5);

  useEffect(() => {
    const indexSize = {
      xl: 15,
      lg: 15,
      md: 10,
      sm: 8,
      xs: 5,
    };
    setMaxIndex(indexSize[breakpoint]);
  }, [breakpoint]);

  const itemsDisplay = useMemo(
    () => [...items].splice(0, maxIndex),
    [items, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= items.length)
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 5);
    };
    if (ref && refCurrent) {
      refCurrent.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [items, maxIndex]);

  const isLoading = useMemo(() => maxIndex < items.length, [items, maxIndex]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        scrollbarWidth: "none",
        alignItems: "center",
      }}
      ref={ref}
    >
      {itemsDisplay.map((item, index) => (
        <ItemShop key={index} item={item} />
      ))}
      {isLoading && <SkeletonAvatars number={4} />}
    </Box>
  );
};

interface Props {
  item: ShopItem;
}

export const ItemShop = ({ item }: Props) => {
  return (
    <>
      {
        {
          AVATAR: <AvatarShop avatar={item as unknown as Avatar} />,
          BADGE: <BadgeShop badge={item as Badge} />,
          BANNER: <BannerShop banner={item as unknown as Banner} />,
          TITLE: <TitleShop title={item as Title} />,
        }[item.type]
      }
    </>
  );
};
