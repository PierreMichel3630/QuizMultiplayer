import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";

import StarIcon from "@mui/icons-material/Star";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { ImageCard } from "../image/ImageCard";

export interface ICardImage {
  id: number;
  name: string;
  image?: string | JSX.Element;
  color?: string;
  type?: SearchType;
}

interface Props {
  value: ICardImage;
  width?: number;
}

export const CardImage = ({ value, width = 90 }: Props) => {
  const navigate = useNavigate();
  const { favorites } = useApp();
  const { mode } = useUser();

  const borderColor = useMemo(
    () => (mode === "dark" ? Colors.white : Colors.black),
    [mode]
  );

  const isFavorite = useMemo(
    () =>
      favorites.some((favorite) =>
        value.type === SearchType.THEME
          ? favorite.theme === value.id
          : favorite.category === value.id
      ),
    [favorites, value]
  );

  const goLink = () => {
    if (value.type)
      navigate(
        value.type === SearchType.THEME
          ? `/theme/${value.id}`
          : `/category/${value.id}`
      );
  };

  return (
    <Box
      onClick={() => goLink()}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        borderRadius: px(10),
        gap: px(2),
        mt: 1,
        width: width,
        position: "relative",
      }}
    >
      <ImageCard value={value} size={width} />
      <Typography
        variant="h6"
        sx={{
          width: percent(100),
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          textAlign: "center",
        }}
      >
        {value.name}
      </Typography>
      {isFavorite && (
        <StarIcon
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            transform: "translate(25%, -25%)",
            fontSize: 40,
            color: Colors.yellow4,
            stroke: borderColor,
          }}
        />
      )}
    </Box>
  );
};
