import { Box, TypographyVariant } from "@mui/material";
import { px } from "csx";
import { Link } from "react-router-dom";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  theme: Theme;
  size?: number;
  variant?: TypographyVariant;
}

export const ThemeBlock = ({ theme, size = 20, variant = "body1" }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: px(4),
        alignItems: "center",
      }}
    >
      <ImageThemeBlock theme={theme} size={size} border={false} />
      <TextNameBlock
        variant={variant}
        sx={{
          overflow: "hidden",
          display: "block",
          lineClamp: 1,
          boxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
        noWrap
        color="text.secondary"
        values={theme.themetranslation}
      />
    </Box>
  );
};

export const ThemeTitleBlock = ({ theme }: Props) => {
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
        <TextNameBlock
          variant="h2"
          sx={{
            wordWrap: "anywhere",
          }}
          color="text.secondary"
          values={theme.themetranslation}
        />
      </Box>
    </Box>
  );
};
