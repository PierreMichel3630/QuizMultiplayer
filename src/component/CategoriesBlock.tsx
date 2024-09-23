import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useBreakpoint } from "src/utils/mediaQuery";
import { CardCategory } from "./card/CardCategory";
import { SkeletonCategories } from "./skeleton/SkeletonCategory";
import { SkeletonThemes } from "./skeleton/SkeletonTheme";

export const CategoriesBlock = () => {
  const { t } = useTranslation();
  const { categories, isLoadingCategories } = useApp();
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();

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

  const categoriesDisplay = useMemo(
    () => [...categories].splice(0, maxIndex),
    [categories, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= categories.length)
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
  }, [categories, maxIndex]);

  const isLoading = useMemo(
    () => maxIndex < categories.length,
    [categories, maxIndex]
  );

  return (
    <Grid container spacing={1}>
      {isLoadingCategories ? (
        <SkeletonCategories number={1} />
      ) : (
        <Grid item xs={12}>
          <>
            {categories.length > 0 && (
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
                  <Typography variant="h2">{t("commun.categories")}</Typography>
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
                    onClick={() => navigate(`/categories`)}
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
                    {categoriesDisplay.map((category) => (
                      <CardCategory key={category.id} category={category} />
                    ))}
                    {isLoading && <SkeletonThemes number={4} />}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ borderBottomWidth: 5 }} />
                </Grid>
              </Grid>
            )}
          </>
        </Grid>
      )}
    </Grid>
  );
};
