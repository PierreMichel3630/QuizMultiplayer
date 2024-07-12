import { Badge, Box, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { JsonLanguage } from "src/models/Language";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

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

interface PropsBadgeAccountActive {
  online: boolean;

  children: string | JSX.Element | JSX.Element[];
}

export const BadgeAccountActive = ({
  online,
  children,
}: PropsBadgeAccountActive) => (
  <Badge
    sx={{
      "& .MuiBadge-badge": {
        backgroundColor: online ? Colors.green : Colors.red,
        color: online ? Colors.green : Colors.red,
        height: px(10),
        width: px(10),
      },
    }}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    overlap="circular"
    variant="dot"
  >
    {children}
  </Badge>
);

interface PropsBadgeTitle {
  label: JsonLanguage;
  onClick?: () => void;
  color?: string;
}

export const BadgeTitle = ({
  label,
  onClick,
  color = Colors.blue3,
}: PropsBadgeTitle) => {
  return (
    <Box
      sx={{
        p: padding(3, 10),
        backgroundColor: color,
        borderRadius: px(10),
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <JsonLanguageBlock
        variant="caption"
        fontSize={12}
        color="text.secondary"
        value={label}
        noWrap
      />
    </Box>
  );
};
