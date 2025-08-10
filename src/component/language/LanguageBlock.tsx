import { Avatar } from "@mui/material";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";

interface PropsLanguageIcon {
  language: Language;
  size?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const LanguageIcon = ({
  language,
  size = 25,
  onClick,
}: PropsLanguageIcon) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  return (
    <Avatar
      alt="flag"
      src={language.icon}
      sx={{
        width: size,
        height: size,
        border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
        cursor: onClick ? "pointer" : "cursor",
      }}
      onClick={(event) => {
        if (onClick) onClick(event);
      }}
    />
  );
};
