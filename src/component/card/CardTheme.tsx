import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Theme } from "src/models/Theme";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { percent, px } from "csx";
import { ImageThemeBlock } from "../ImageThemeBlock";

interface Props {
  theme: Theme;
}

export const CardTheme = ({ theme }: Props) => {
  const navigate = useNavigate();

  const goTheme = () => {
    navigate(`/theme/${theme.id}`);
  };

  return (
    <Box
      onClick={() => goTheme()}
      sx={{
        width: percent(100),
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        p: px(5),
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(5),
      }}
    >
      <ImageThemeBlock theme={theme} />
      <JsonLanguageBlock
        variant="h4"
        sx={{ textAlign: "center" }}
        value={theme.name}
      />
    </Box>
  );
};
