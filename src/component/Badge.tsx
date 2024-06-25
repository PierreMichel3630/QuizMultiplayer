import { Badge, Box, Typography, styled } from "@mui/material";
import { padding, px } from "csx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { JsonLanguage } from "src/models/Language";

interface Props {
  value: string;
}
export const BadgeDifficulty = ({ value }: Props) => {
  const { t } = useTranslation();

  const getColor = useCallback(() => {
    let color: string = Colors.black;
    if (value === "FACILE") {
      color = Colors.green;
    } else if (value === "MOYEN") {
      color = Colors.orange2;
    } else if (value === "DIFFICILE") {
      color = Colors.red;
    }
    return color;
  }, [value]);

  return (
    <Box
      sx={{
        p: padding(2, 8),
        backgroundColor: getColor(),
        borderRadius: px(10),
        width: "fit-content",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ color: "white" }}>
        {t(`enum.difficulty.${value}`)}
      </Typography>
    </Box>
  );
};

interface PropsTheme {
  value: Theme;
}
export const BadgeTheme = ({ value }: PropsTheme) => {
  return (
    <Box
      sx={{
        p: padding(2, 8),
        backgroundColor: Colors.purple,
        borderRadius: px(10),
        width: "fit-content",
      }}
    >
      <JsonLanguageBlock
        variant="h2"
        sx={{ color: "white" }}
        value={value.name}
      />
    </Box>
  );
};

export const BadgeAccountActive = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "80%",
      height: "80%",
      borderRadius: "50%",
      animation: "ripple 1.2s 3 ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface PropsBadgeTitle {
  label: JsonLanguage;
}

export const BadgeTitle = ({ label }: PropsBadgeTitle) => {
  return (
    <Box
      sx={{
        p: padding(2, 8),
        backgroundColor: Colors.purple,
        borderRadius: px(10),
      }}
    >
      <JsonLanguageBlock variant="h6" color="text.secondary" value={label} />
    </Box>
  );
};
