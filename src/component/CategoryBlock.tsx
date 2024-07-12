import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { CategoryWithThemes } from "src/models/Category";
import { sortByName } from "src/utils/sort";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CardTheme } from "./card/CardTheme";
import { SkeletonThemes } from "./skeleton/SkeletonTheme";
import { useBreakpoint } from "src/utils/mediaQuery";

interface Props {
  category: CategoryWithThemes;
}
export const CategoryBlock = ({ category }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useUser();
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

  const themesCategory = useMemo(
    () => category.themes.sort((a, b) => sortByName(language, a, b)),
    [category, language]
  );

  const themes = useMemo(
    () => [
      ...themesCategory.filter((el) => el.isfirst),
      ...themesCategory.filter((el) => !el.isfirst),
    ],
    [themesCategory]
  );

  const themesDisplay = useMemo(
    () => [...themes].splice(0, maxIndex),
    [themes, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= themes.length)
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
  }, [themes, maxIndex]);

  const isLoading = useMemo(() => maxIndex < themes.length, [themes, maxIndex]);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <JsonLanguageBlock variant="h2" sx={{ ml: 2 }} value={category.name} />
        <Button
          variant="outlined"
          sx={{
            minWidth: "auto",
            textTransform: "uppercase",
            "&:hover": {
              border: "2px solid currentColor",
            },
          }}
          color="secondary"
          size="small"
          onClick={() => navigate(`/category/${category.id}`)}
        >
          <Typography variant="h6" noWrap>
            {t("commun.seeall")}
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: px(10),
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          ref={ref}
        >
          {themesDisplay.map((theme) => (
            <CardTheme key={theme.id} theme={theme} />
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
