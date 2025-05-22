import { Box } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

import NoPhotographyIcon from "@mui/icons-material/NoPhotography";

interface Props {
  theme: { image?: string | JSX.Element; color?: string };
  size?: string | number;
  border?: boolean;
}

export const ImageThemeBlock = ({
  theme,
  size = percent(100),
  border = true,
}: Props) => {
  const { mode } = useUser();

  const borderColor = useMemo(
    () => (mode === "dark" ? Colors.white : Colors.black),
    [mode]
  );

  const image = useMemo(
    () =>
      theme.image && typeof theme.image == "string" ? theme.image : undefined,
    [theme.image]
  );

  const height = useMemo(
    () => (Number.isFinite(size) ? Number(size) * 0.9 : size),
    [size]
  );

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
        border: border ? `2px solid ${borderColor}` : "none",
      }}
    >
      {image ? (
        <img
          alt="logo theme"
          src={image}
          srcSet={image}
          loading="lazy"
          style={{
            maxWidth: percent(90),
            maxHeight: height,
          }}
        />
      ) : (
        <NoPhotographyIcon
          sx={{
            width: height,
            height: height,
            color: "white",
          }}
        />
      )}
    </Box>
  );
};
