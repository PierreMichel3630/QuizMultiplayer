import { Badge, Box, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { JsonLanguage } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { TitleProfile } from "src/models/Title";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";

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
}

export const BadgeTitle = ({ label, onClick }: PropsBadgeTitle) => {
  return (
    <Box
      sx={{
        p: padding(3, 10),
        backgroundColor: Colors.colorApp,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        textAlign: "center",
        borderRadius: px(5),
      }}
      onClick={onClick}
    >
      <JsonLanguageBlock variant="h6" color="text.secondary" value={label} />
    </Box>
  );
};

interface PropsBadgeTitleProfile {
  onClick?: () => void;
  isSelect?: boolean;
  title: TitleProfile;
}

export const BadgeTitleProfile = ({
  isSelect,
  onClick,
  title,
}: PropsBadgeTitleProfile) => {
  return (
    <Box
      sx={{
        p: padding(3, 10),
        backgroundColor: Colors.colorApp,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        textAlign: "center",
        borderRadius: px(5),
        display: "flex",
        alignItems: "center",
        gap: 1,
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <Box>
        {title.multiplicator !== null && (
          <Typography variant="h6" component="span">
            {title.multiplicator} x{" "}
          </Typography>
        )}
        <JsonLanguageBlock
          component="span"
          variant="h6"
          color="text.secondary"
          value={title.title.name}
        />
      </Box>
      {isSelect && (
        <CheckCircleTwoToneIcon
          sx={{
            color: Colors.green2,
            backgroundColor: "white",
            borderRadius: percent(50),
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
};
