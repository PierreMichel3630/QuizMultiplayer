import { Box } from "@mui/material";
import { percent, px } from "csx";

interface Props {
  theme: { image: string; color: string };
  size?: string | number;
}

export const ImageThemeBlock = ({ theme, size = percent(100) }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: theme.color,
        width: size,
        aspectRatio: "1/1",
        borderRadius: px(5),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={theme.image}
        srcSet={theme.image}
        loading="lazy"
        style={{
          maxWidth: percent(90),
          maxHeight: Number.isFinite(size) ? Number(size) * 0.9 : size,
        }}
      />
    </Box>
  );
};
