import { Avatar, Chip } from "@mui/material";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";

interface Props {
  theme: Theme;
  onDelete: () => void;
}

export const ChipThemeEdit = ({ theme, onDelete }: Props) => {
  const { language } = useUser();
  const label = useMemo(() => {
    if (theme && language) {
      const translations = [...theme.themetranslation];
      const trad = translations.find((el) => el.language.id === language.id);
      return trad ? trad.name : translations[1].name;
    } else {
      return "";
    }
  }, [language, theme]);
  return (
    <Chip
      avatar={
        <Avatar>
          <ImageThemeBlock theme={theme} size={35} />
        </Avatar>
      }
      label={label}
      variant="outlined"
      onDelete={onDelete}
    />
  );
};
