import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";

import StarIcon from "@mui/icons-material/Star";
import { useMemo } from "react";
import ListMode from "src/assets/mode/list.png";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { BadgeNew } from "../badge/BadgeNew";
import { ImageCard } from "../image/ImageCard";

export interface ICardImageOrder extends ICardImage {
  order: number;
}

export interface ICardImage {
  id: number;
  identifier?: string;
  name: string;
  image?: string | JSX.Element;
  color?: string;
  type?: SearchType;
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
    if (value.type) {
      let link = "/";
      switch (value.type) {
        case SearchType.GAME:
          link = `/gamemode/${value.identifier}`;
          break;
        case SearchType.THEME:
          link = `/theme/${value.id}`;
          break;
        case SearchType.CATEGORY:
          link = `/category/${value.id}`;
          break;
        case SearchType.LIST:
          link = `/list/${value.id}`;
          break;
      }
      navigate(link);
    }
  };

  const valueImageCard = useMemo(() => {
    let result = { image: value.image, color: value.color };
    switch (value.type) {
      case SearchType.LIST:
        result = { image: ListMode, color: Colors.colorList };
        break;
      case SearchType.GAME:
        result = { image: value.image, color: Colors.colorBrainTest };
        break;
      case SearchType.CATEGORY:
      case SearchType.GAMEMODE:
      case SearchType.THEME:
        result = { image: value.image, color: value.color };
        break;
    }
    return result;
  }, [value]);

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
        width: width,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <BadgeNew date={value.created_at} />
        <ImageCard value={valueImageCard} size={width} />
      </Box>
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
