import { Box, Tooltip } from "@mui/material";
import { Fragment, useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";

interface Props {
  themes: Array<Theme>;
}

export const ThemesList = ({ themes }: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {themes.map((theme, index) => (
        <Fragment key={index}>
          <ThemeImageTooltip theme={theme} />
        </Fragment>
      ))}
    </Box>
  );
};

interface PropsThemeImageTooltip {
  theme: Theme;
}
const ThemeImageTooltip = ({ theme }: PropsThemeImageTooltip) => {
  const { language } = useUser();

  const label = useMemo(() => {
    const themeTranslations = [...theme.themetranslation];
    const themeTranslation = themeTranslations.find(
      (el) => el.language.id === language?.id
    );
    return themeTranslation ? themeTranslation.name : "";
  }, [theme, language]);

  return (
    <Tooltip title={label} placement="top" arrow>
      <span>
        <ImageThemeBlock key={theme.id} theme={theme} size={40} />
      </span>
    </Tooltip>
  );
};
