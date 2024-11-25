import { Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { PreviousGame } from "src/models/PreviousGame";
import { Theme } from "src/models/Theme";
import { useBreakpoint } from "src/utils/mediaQuery";
import { CardTheme } from "./card/CardTheme";
import { SkeletonThemes } from "./skeleton/SkeletonTheme";

export const PreviousGameBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themes } = useApp();
  const breakpoint = useBreakpoint();

  const ref = useRef<HTMLDivElement | null>(null);
  const [maxIndex, setMaxIndex] = useState(5);

  const [themesPrevious, setThemesPrevious] = useState<Array<Theme>>([]);

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

  useEffect(() => {
    if (user) {
      selectLastXThemeByPlayer(user.id, 10).then(({ data }) => {
        const res = data as Array<PreviousGame>;
        const previousTheme = res.map((el) => el.theme);
        const result = previousTheme.reduce((acc, id) => {
          const theme = themes.find((el) => el.id === id);
          return theme ? [...acc, theme] : acc;
        }, [] as Array<Theme>);

        setThemesPrevious(result);
      });
    }
  }, [themes, user]);

  const themesDisplay = useMemo(
    () => [...themesPrevious].splice(0, maxIndex),
    [themesPrevious, maxIndex]
  );

  useEffect(() => {
    const refCurrent = ref.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.offsetWidth + refCurrent.scrollLeft + 450 <=
          refCurrent.scrollWidth ||
          maxIndex >= themesPrevious.length)
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
  }, [themesPrevious, maxIndex]);

  const isLoading = useMemo(
    () => maxIndex < themesPrevious.length,
    [themesPrevious, maxIndex]
  );

  return (
    themesPrevious.length > 0 && (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("commun.previousgame")}</Typography>
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
            {themesDisplay.map((theme, index) => (
              <CardTheme key={index} theme={theme} />
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
