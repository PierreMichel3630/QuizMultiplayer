import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";

import ExploreIcon from "@mui/icons-material/Explore";
import { useAppBar } from "src/context/AppBarProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { padding, px } from "csx";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Colors } from "src/style/Colors";
import { BadgeDot } from "../badge/BadgeDot";

interface PropsBadgeIconButton {
  icon: JSX.Element;
  onClick: () => void;
}

const BadgeIconButton = ({ icon, onClick }: PropsBadgeIconButton) => {
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
  icon?: JSX.Element;
  notifications?: boolean;
}

interface PropsBadgeButton {
  value: ButtonValue;
}

const BadgeButton = ({ value }: PropsBadgeButton) => {
  const theme = useTheme();
  const isDark = useMemo(() => theme.palette.mode === "dark", [theme]);
  return (
    <Box
      sx={
        value.notifications
          ? {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              cursor: "pointer",
              "--border-angle": "0deg",
              borderRadius: "4px",
              boxShadow: "0px 2px 4px hsl(0 0% 0% / 25%)",
              animation: "border-angle-rotate 2s infinite linear",
              border: "5px solid transparent",
              position: "relative",
              background: `linear-gradient(${Colors.black}, ${Colors.black}) padding-box, conic-gradient(from var(--border-angle),oklch(100% 100% 0deg),oklch(100% 100% 45deg),oklch(100% 100% 90deg),oklch(100% 100% 135deg),oklch(100% 100% 180deg),oklch(100% 100% 225deg),oklch(100% 100% 270deg),oklch(100% 100% 315deg),oklch(100% 100% 360deg)) border-box`,
            }
          : {}
      }
    >
      <Button
        variant="contained"
        sx={{
          display: "flex",
          gap: px(5),
          borderRadius: px(0),
          backgroundColor: isDark
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
          color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
          "&:hover": {
            backgroundColor: isDark
              ? theme.palette.grey[700]
              : theme.palette.grey[400],
          },
          transition: "border-color 0.3s ease",
          borderColor: "secondary.main",
        }}
        size="small"
        component={Link}
        to={value.link}
      >
        {value.icon !== undefined && value.icon}
        <Typography variant="h6">{value.label}</Typography>
        {value.notifications && <BadgeDot />}
      </Button>
    </Box>
  );
};

interface PropsBadgeButtonGroup {
  values: Array<ButtonValue>;
}
const BadgeButtonGroup = ({ values }: PropsBadgeButtonGroup) => (
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
    alignItems="center"
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
  const { hasPlayChallenge } = useAuth();

  const buttons = useMemo(
    () => [
      {
        icon: <EmojiEventsIcon fontSize="small" />,
        label: t("commun.daychallenge"),
        link: "/challenge",
        notifications: !hasPlayChallenge,
      },
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
    [hasPlayChallenge, profile, t],
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
