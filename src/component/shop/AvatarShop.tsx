import { Avatar, Box } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { Avatar as IAvatar } from "src/models/Avatar";
import { Colors } from "src/style/Colors";
import { useBreakpoint } from "src/utils/mediaQuery";
import { MoneyBlock } from "../MoneyBlock";
import { SkeletonAvatars } from "../skeleton/SkeletonShop";

export const AvatarShopBlock = () => {
  const breakpoint = useBreakpoint();
  const { avatars } = useApp();

  const ref = useRef<HTMLDivElement | null>(null);
  const [maxIndex, setMaxIndex] = useState(5);

  const avatarsCanBuy = useMemo(
    () => [...avatars].filter((el) => el.price > 0),
    [avatars]
  );

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

  const avatarsDisplay = useMemo(
    () => [...avatarsCanBuy].splice(0, maxIndex),
    [avatarsCanBuy, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= avatarsCanBuy.length)
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
  }, [avatarsCanBuy, maxIndex]);

  const isLoading = useMemo(
    () => maxIndex < avatarsCanBuy.length,
    [avatarsCanBuy, maxIndex]
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
      {avatarsDisplay.map((avatar) => (
        <AvatarShop key={avatar.id} avatar={avatar} />
      ))}
      {isLoading && <SkeletonAvatars number={4} />}
    </Box>
  );
};

interface Props {
  avatar: IAvatar;
}

export const AvatarShop = ({ avatar }: Props) => {
  return (
    <Link to={`/avatar/${avatar.id}`} style={{ textDecoration: "none" }}>
      <Box>
        <Avatar
          sx={{
            cursor: "pointer",
            width: 60,
            height: 60,
          }}
          src={avatar.icon}
        />
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
          <MoneyBlock money={avatar.price} variant="h6" />
        </Box>
      </Box>
    </Link>
  );
};
