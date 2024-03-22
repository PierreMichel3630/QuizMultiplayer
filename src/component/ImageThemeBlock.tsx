import { Box } from "@mui/material";
import { percent, px } from "csx";
import { Theme } from "src/models/Theme";

interface Props {
  theme: Theme;
}

export const ImageThemeBlock = ({ theme }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: theme.color,
        width: percent(100),
        aspectRatio: "1/1",
        borderRadius: px(5),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={theme.image}
        style={{
          maxWidth: percent(80),
          maxHeight: percent(80),
        }}
      />
    </Box>
  );
};
