import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { Theme } from "src/models/Theme";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Link } from "react-router-dom";
import { Variant } from "@mui/material/styles/createTypography";

interface Props {
  theme: Theme;
}

export const ThemeBlock = ({ theme }: Props) => {
  const { language } = useUser();
  const name = useMemo(() => {
    const translations = [...theme.themetranslation];
    if (language && translations.length > 0) {
      const trad = translations.find((el) => el.language.id === language?.id);
      return trad ? trad.name : translations[1].name;
    }
    return "";
  }, [language, theme.themetranslation]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: px(4),
        alignItems: "center",
      }}
    >
      <ImageThemeBlock theme={theme} size={20} border={false} />
      <Typography
        variant="body1"
        sx={{
          overflow: "hidden",
          display: "block",
          lineClamp: 1,
          boxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
        noWrap
      >
        {name}
      </Typography>
    </Box>
  );
};

export const ThemeTitleBlock = ({ theme }: Props) => {
  const { language } = useUser();
  const name = useMemo(() => {
    const translations = [...theme.themetranslation];
    const trad = translations.find((el) => el.language.id === language?.id);
    return trad ? trad.name : translations[1].name;
  }, [language, theme.themetranslation]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Link to={`/theme/${theme.id}`} style={{ textDecoration: "none" }}>
        <ImageThemeBlock theme={theme} size={50} />
      </Link>
      <Box>
        <Typography
          variant="h2"
          sx={{
            wordWrap: "anywhere",
          }}
          color="text.secondary"
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};

interface PropsThemeNameBlock {
  theme: Theme;
  variant?: Variant;
}

export const ThemeNameBlock = ({
  theme,
  variant = "h2",
}: PropsThemeNameBlock) => {
  const { language } = useUser();
  const name = useMemo(() => {
    const translations = [...theme.themetranslation];
    const trad = translations.find((el) => el.language.id === language?.id);
    return trad ? trad.name : translations[1].name;
  }, [language, theme.themetranslation]);

  return (
    <Typography
      variant={variant}
      sx={{
        wordWrap: "anywhere",
      }}
      color="text.secondary"
    >
      {name}
    </Typography>
  );
};
