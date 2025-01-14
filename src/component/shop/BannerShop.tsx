import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Banner } from "src/models/Banner";
import { Colors } from "src/style/Colors";
import { MoneyBlock } from "../MoneyBlock";

import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBreakpoint } from "src/utils/mediaQuery";
import { SkeletonBanners } from "../skeleton/SkeletonShop";

interface PropsBannerShopBlock {
  banners: Array<Banner>;
}
export const BannerShopBlock = ({ banners }: PropsBannerShopBlock) => {
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

  const bannersDisplay = useMemo(
    () => [...banners].splice(0, maxIndex),
    [banners, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= banners.length)
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
  }, [banners, maxIndex]);

  const isLoading = useMemo(
    () => maxIndex < banners.length,
    [banners, maxIndex]
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
      ref={ref}
    >
      {bannersDisplay.map((banner) => (
        <BannerShop key={banner.id} banner={banner} />
      ))}
      {isLoading && <SkeletonBanners number={4} />}
    </Box>
  );
};

interface Props {
  banner: Banner;
  height?: number;
}

export const BannerShop = ({ banner, height = 80 }: Props) => {
  return (
    <Link to={`/banner/${banner.id}`} style={{ textDecoration: "none" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: px(3) }}>
        <img
          src={`/banner/${banner.icon}`}
          style={{
            height: px(height),
          }}
        />
        {banner.price > 0 ? (
          <Box
            sx={{
              backgroundColor: Colors.grey4,
              p: "2px 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: px(5),
            }}
          >
            <MoneyBlock money={banner.price} variant="h6" />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.black,
              p: 1,
            }}
          >
            <LockTwoToneIcon
              sx={{
                fontSize: 20,
                color: Colors.grey4,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {t("commun.unlockaccomplishments")}
            </Typography>
          </Box>
        )}
      </Box>
    </Link>
  );
};
