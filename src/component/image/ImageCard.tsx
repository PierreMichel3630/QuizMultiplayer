import { Box } from "@mui/material";
import { percent, px } from "csx";

interface Props {
  value: { image: string | JSX.Element; color: string };
  size?: string | number;
}

export const ImageCard = ({ value, size = percent(100) }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: value.color,
        width: size,
        aspectRatio: "1/1",
        borderRadius: px(10),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid white",
      }}
    >
      {typeof value.image === "string" ? (
        <img
          src={value.image}
          srcSet={value.image}
          loading="lazy"
          style={{
            maxWidth: percent(90),
            maxHeight: Number.isFinite(size) ? Number(size) * 0.9 : size,
          }}
        />
      ) : (
        value.image
      )}
    </Box>
  );
};
