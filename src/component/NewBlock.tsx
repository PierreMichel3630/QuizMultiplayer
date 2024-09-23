import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { sortByCreatedAt } from "src/utils/sort";
import { CardTheme } from "./card/CardTheme";
import { uniqBy } from "lodash";
import { SkeletonThemes } from "./skeleton/SkeletonTheme";
import { useBreakpoint } from "src/utils/mediaQuery";
import { useNavigate } from "react-router-dom";

export const NewBlock = () => {
  const { t } = useTranslation();
  const { themes } = useApp();
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

  const themesNew = useMemo(() => {
    return uniqBy(
      themes
        .filter((el) => moment().diff(el.created_at, "days") < 7)
        .sort(sortByCreatedAt),
      (el) => el.id
    );
  }, [themes]);

  const themesDisplay = useMemo(
    () => [...themesNew].splice(0, maxIndex),
    [themesNew, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= themesNew.length)
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
  }, [themesNew, maxIndex]);

  const isLoading = useMemo(
    () => maxIndex < themesNew.length,
    [themesNew, maxIndex]
  );

  return (
    themesNew.length > 0 && (
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
          <Typography variant="h2">{t("commun.new")}</Typography>
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
            onClick={() => navigate(`/new`)}
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
    )
  );
};
