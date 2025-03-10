import { Box } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

import NoPhotographyIcon from "@mui/icons-material/NoPhotography";

interface Props {
  theme: { image?: string; color: string };
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
      {theme.image ? (
        <img
          alt="logo theme"
          src={theme.image}
          srcSet={theme.image}
          loading="lazy"
          style={{
            maxWidth: percent(90),
            maxHeight: Number.isFinite(size) ? Number(size) * 0.9 : size,
          }}
        />
      ) : (
        <NoPhotographyIcon
          sx={{
            width: 60,
            height: 60,
            color: "white",
          }}
        />
      )}
    </Box>
  );
};
