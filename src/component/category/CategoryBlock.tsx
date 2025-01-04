import { Box, Divider, Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBreakpoint } from "src/utils/mediaQuery";
import { CardImage, ICardImage } from "../card/CardImage";
import { SkeletonThemes } from "../skeleton/SkeletonTheme";
import { TitleCategories } from "./TitleCategories";
import { JsonLanguage } from "src/models/Language";

interface Props {
  title: string | JsonLanguage;
  count: number;
  link?: string;
  values: Array<ICardImage>;
}

export const CategoryBlock = ({ title, count, link, values }: Props) => {
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

  const valuesDisplay = useMemo(
    () => [...values].splice(0, maxIndex),
    [values, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= values.length)
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
  }, [values, maxIndex]);

  const isLoading = useMemo(() => maxIndex < values.length, [values, maxIndex]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TitleCategories title={title} count={count} link={link} />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          ref={ref}
        >
          {valuesDisplay.map((value, index) => (
            <CardImage key={index} value={value} />
          ))}
          {isLoading && <SkeletonThemes number={4} />}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
