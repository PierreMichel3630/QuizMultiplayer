import { Avatar, Box, Typography } from "@mui/material";
import { px } from "csx";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Badge } from "src/models/Badge";
import { Colors } from "src/style/Colors";
import { MoneyBlock } from "../MoneyBlock";

import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBreakpoint } from "src/utils/mediaQuery";
import { SkeletonBadges } from "../skeleton/SkeletonShop";

interface PropsBadgeShopBlock {
  badges: Array<Badge>;
}

export const BadgeShopBlock = ({ badges }: PropsBadgeShopBlock) => {
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

  const badgesDisplay = useMemo(
    () => [...badges].splice(0, maxIndex),
    [badges, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= badges.length)
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
  }, [badges, maxIndex]);

  const isLoading = useMemo(() => maxIndex < badges.length, [badges, maxIndex]);

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
      {badgesDisplay.map((badge) => (
        <BadgeShop key={badge.id} badge={badge} />
      ))}
      {isLoading && <SkeletonBadges number={4} />}
    </Box>
  );
};

interface Props {
  badge: Badge;
}

export const BadgeShop = ({ badge }: Props) => {
  return (
    <Link
      to={`/badge/${badge.id}`}
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        gap: px(3),
        alignItems: "center",
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
        }}
        src={badge.icon}
      />
      {badge.price > 0 ? (
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
          <MoneyBlock money={badge.price} variant="h6" />
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: Colors.grey4,
            p: px(2),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: px(5),
            maxWidth: px(80),
          }}
        >
          <LockTwoToneIcon
            sx={{
              fontSize: 20,
              color: Colors.black,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {t("commun.unlockaccomplishments")}
          </Typography>
        </Box>
      )}
    </Link>
  );
};
