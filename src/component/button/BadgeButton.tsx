import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";

import ExploreIcon from "@mui/icons-material/Explore";
import { useAppBar } from "src/context/AppBarProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { padding, px } from "csx";

interface PropsBadgeIconButton {
  icon: JSX.Element;
  onClick: () => void;
}

export const BadgeIconButton = ({ icon, onClick }: PropsBadgeIconButton) => {
  const theme = useTheme();
  const isDark = useMemo(() => theme.palette.mode === "dark", [theme]);
  return (
    <Box
      sx={{
        p: padding(2, 8),
        borderRadius: px(5),
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark
          ? theme.palette.grey[800]
          : theme.palette.grey[300],
        color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
        "&:hover": {
          backgroundColor: isDark
            ? theme.palette.grey[700]
            : theme.palette.grey[400],
        },
      }}
      onClick={onClick}
    >
      {icon}
    </Box>
  );
};

interface ButtonValue {
  label: string;
  link: string;
}

interface PropsBadgeButton {
  value: ButtonValue;
}

export const BadgeButton = ({ value }: PropsBadgeButton) => {
  const theme = useTheme();
  const isDark = useMemo(() => theme.palette.mode === "dark", [theme]);
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: isDark
          ? theme.palette.grey[800]
          : theme.palette.grey[300],
        color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
        "&:hover": {
          backgroundColor: isDark
            ? theme.palette.grey[700]
            : theme.palette.grey[400],
        },
      }}
      size="small"
      component={Link}
      to={value.link}
    >
      <Typography variant="h6">{value.label}</Typography>
    </Button>
  );
};

interface PropsBadgeButtonGroup {
  values: Array<ButtonValue>;
}
export const BadgeButtonGroup = ({ values }: PropsBadgeButtonGroup) => (
  <Grid
    container
    spacing={1}
    wrap="nowrap"
    sx={{
      overflowX: "auto",
      width: "100%",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    }}
  >
    {values.map((el, index) => (
      <Grid key={index} sx={{ flexShrink: 0 }}>
        <BadgeButton value={el} />
      </Grid>
    ))}
  </Grid>
);

export const BadgeButtonRedirection = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { toogleOpenDrawer } = useAppBar();
  const isMobileOrTablet = useIsMobileOrTablet();

  const buttons = useMemo(
    () => [
      { label: t("commun.daychallenge"), link: "/challenge" },
      { label: t("commun.gamemode"), link: "/gamemode" },
      { label: t("mode.list"), link: "/list" },
      { label: t("commun.favorite"), link: "/favorite" },
      { label: t("commun.new"), link: "/new" },
      { label: t("commun.mostplayedthemes"), link: "/mostplayedthemes" },
      { label: t("commun.categories"), link: "/categories" },
      { label: t("commun.people"), link: "/people" },
      ...(profile
        ? [
            { label: t("commun.myprofile"), link: `/profil/${profile.id}` },
            { label: t("commun.mygames"), link: "/games" },
            { label: t("commun.lastplayedthemes"), link: "/lastplayedthemes" },
          ]
        : []),
    ],
    [profile, t],
  );

  const openDrawer = () => {
    toogleOpenDrawer();
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {isMobileOrTablet && (
        <BadgeIconButton
          icon={<ExploreIcon fontSize="small" />}
          onClick={openDrawer}
        />
      )}
      <BadgeButtonGroup values={buttons} />
    </Box>
  );
};
