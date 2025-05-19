import { Box } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";
import BoltIcon from "@mui/icons-material/Bolt";

interface Props {
  value: { image?: string | JSX.Element; color?: string };
  size?: string | number;
}

export const ImageCard = ({ value, size = percent(100) }: Props) => {
  const { mode } = useUser();

  const borderColor = useMemo(
    () => (mode === "dark" ? Colors.white : Colors.black),
    [mode]
  );

  return (
    <Box
      sx={{
        backgroundColor: value.color ?? Colors.colorApp,
        width: size,
        aspectRatio: "1/1",
        borderRadius: px(10),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid",
        borderColor,
      }}
    >
      {typeof value.image === "string" ? (
        <img
          alt="unknow"
          src={value.image}
          srcSet={value.image}
          loading="lazy"
          style={{
            maxWidth: percent(90),
            maxHeight: Number.isFinite(size) ? Number(size) * 0.9 : size,
          }}
        />
      ) : (
        value.image ?? (
          <BoltIcon
            sx={{
              width: 80,
              height: 80,
              color: "white",
            }}
          />
        )
      )}
    </Box>
  );
};
