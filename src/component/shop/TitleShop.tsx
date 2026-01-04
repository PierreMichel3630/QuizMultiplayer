import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { MoneyBlock } from "../MoneyBlock";

import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBreakpoint } from "src/utils/mediaQuery";
import { TextNameBlock } from "../language/TextLanguageBlock";
import { SkeletonTitles } from "../skeleton/SkeletonShop";

interface PropsTitleShopBlock {
  titles: Array<Title>;
}

export const TitleShopBlock = ({ titles }: PropsTitleShopBlock) => {
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

  const titlesDisplay = useMemo(
    () => [...titles].splice(0, maxIndex),
    [titles, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= titles.length)
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
  }, [titles, maxIndex]);

  const isLoading = useMemo(() => maxIndex < titles.length, [titles, maxIndex]);

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
      {titlesDisplay.map((title) => (
        <TitleShop key={title.id} title={title} />
      ))}
      {isLoading && <SkeletonTitles number={4} />}
    </Box>
  );
};

interface Props {
  title: Title;
  noWrap?: boolean;
}

export const TitleShop = ({ title, noWrap = true }: Props) => {
  return (
    <Link to={`/title/${title.id}`} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: Colors.grey4,
          borderRadius: px(5),
          p: "2px 5px",
          textAlign: "center",
        }}
      >
        <TextNameBlock
          variant="h6"
          color="text.secondary"
          noWrap={noWrap}
          values={title.titletranslation}
        />
        {title.price > 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MoneyBlock money={title.price} variant="h6" />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LockTwoToneIcon
              sx={{
                fontSize: 20,
                color: Colors.black,
              }}
            />
            <Typography variant="caption" color="text.secondary" noWrap>
              {t("commun.unlockaccomplishments")}
            </Typography>
          </Box>
        )}
      </Box>
    </Link>
  );
};
