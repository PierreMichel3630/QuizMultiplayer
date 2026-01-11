import { Button, Grid, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
      pb: 1,
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
  const buttons = [
    { label: t("commun.daychallenge"), link: "/challenge" },
    { label: t("commun.favorite"), link: "/favorite" },
    { label: t("commun.gamemode"), link: "/gamemode" },
    { label: t("commun.categories"), link: "/categories" },
  ];

  return <BadgeButtonGroup values={buttons} />;
};
