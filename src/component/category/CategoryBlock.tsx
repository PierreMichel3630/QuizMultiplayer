import { Box, Divider, Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardImage, ICardImage } from "../card/CardImage";
import { SkeletonThemes } from "../skeleton/SkeletonTheme";
import { TitleCategories } from "./TitleCategories";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { px } from "csx";
import { isMobile } from "react-device-detect";

interface Props {
  title: string;
  count?: number;
  link?: string;
  values: Array<ICardImage>;
  handleScroll?: () => void;
  isLoading?: boolean;
}

export const CategoryBlock = ({
  title,
  count,
  link,
  values,
  handleScroll,
  isLoading = true,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const [displayLeft, setDisplayLeft] = useState(false);
  const [displayRight, setDisplayRight] = useState(true);

  const isEnd = useMemo(
    () => (count ? values.length >= count : true),
    [count, values.length]
  );

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!isEnd) {
          if (handleScroll) handleScroll();
        } else {
          setDisplayRight(false);
        }
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [isLoading, isEnd, handleScroll]);

  const scroll = (scrollOffset: number) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const newValue = scrollLeft + scrollOffset;
      ref.current.scrollTo({
        left: newValue,
        behavior: "smooth",
      });
      setDisplayLeft(newValue > 0);
      setDisplayRight(newValue + clientWidth <= scrollWidth);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TitleCategories title={title} count={count} link={link} />
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", position: "relative" }}>
        {displayLeft && !isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: px(40),
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={() => scroll(-100)}
          >
            <ArrowBackIosIcon sx={{ fontSize: 40 }} />
          </Box>
        )}
        <Box
          id={title}
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            ml: displayLeft ? px(40) : 0,
            mr: displayRight && !isMobile ? px(40) : 0,
          }}
          ref={ref}
        >
          {values.map((value, index) => (
            <Box
              key={index}
              ref={index === values.length - 1 ? lastItemRef : null}
            >
              <CardImage value={value} />
            </Box>
          ))}
          {!isEnd && <SkeletonThemes number={4} />}
        </Box>
        {displayRight && !isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: px(40),
              right: px(0),
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={() => scroll(100)}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 40 }} />
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
