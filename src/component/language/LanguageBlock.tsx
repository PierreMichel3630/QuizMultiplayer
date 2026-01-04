import { Avatar, Box } from "@mui/material";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";

interface PropsLanguageIcon {
  language: Language;
  size?: number;
  color?: string;
  borderSize?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const LanguageIcon = ({
  language,
  size = 25,
  borderSize = 2,
  color,
  onClick,
}: PropsLanguageIcon) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const colorBase = useMemo(
    () => (isDarkMode ? Colors.white : Colors.black),
    [isDarkMode]
  );

  return (
    <Avatar
      alt="flag"
      src={language.icon}
      sx={{
        width: size,
        height: size,
        borderStyle: `solid`,
        borderWidth: borderSize,
        borderColor: color ?? colorBase,
        cursor: onClick ? "pointer" : "cursor",
      }}
      onClick={(event) => {
        if (onClick) onClick(event);
      }}
    />
  );
};

interface PropsLanguagesIcon {
  language: Language;
  languages: Array<Language>;
  size?: number;
  onSelect?: (value: Language) => void;
}

export const LanguagesIcon = ({
  language,
  languages,
  size = 25,
  onSelect,
}: PropsLanguagesIcon) => {
  const selected = useMemo(
    () => [...languages].findIndex((el) => el.id === language.id),
    [language, languages]
  );

  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      {languages.map((language, index) => (
        <LanguageIcon
          key={index}
          language={language}
          size={size}
          borderSize={5}
          color={selected === index ? Colors.green : undefined}
          onClick={() => {
            if (onSelect) onSelect(language);
          }}
        />
      ))}
    </Box>
  );
};
