import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";

import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { ImageTypeCard } from "../image/ImageCard";

import StarIcon from "@mui/icons-material/Star";
import { getLink } from "src/utils/link";

export interface ICardImageOrder extends ICardImage {
  order: number;
}

export interface ICardImage {
  id: number | string;
  name: string;
  image?: string | JSX.Element;
  color?: string;
  type: SearchType;
  onClick?: () => void;
  minversion?: string;
  created_at: Date;
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
    [mode],
  );

  const isFavorite = useMemo(
    () =>
      favorites.some((favorite) =>
        value.type === SearchType.THEME
          ? favorite.theme === value.id
          : favorite.category === value.id,
      ),
    [favorites, value],
  );

  const goLink = () => {
    const link = getLink(value.type, value.id);
    navigate(link);
  };

  return (
    <Box
      onClick={() => (value.onClick ? value.onClick() : goLink())}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        borderRadius: px(10),
        gap: px(2),
        mt: 1,
        position: "relative",
      }}
    >
      <ImageTypeCard type={value.type} value={value} size={width} />
      <Typography
        variant="h6"
        sx={{
          minWidth: px(90),
          width: "min-content",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          textAlign: "center",
          wordBreak: "keep-all",
          overflowWrap: "normal",
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
