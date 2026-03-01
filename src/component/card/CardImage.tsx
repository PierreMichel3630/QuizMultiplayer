import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";

import StarIcon from "@mui/icons-material/Star";
import { green } from "@mui/material/colors";
import moment from "moment";
import { useMemo } from "react";
import ListMode from "src/assets/mode/list.png";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import { BadgeNew } from "../badge/BadgeNew";
import { ImageCard } from "../image/ImageCard";

export interface ICardImageOrder extends ICardImage {
  order: number;
}

export interface ICardImage {
  id: number;
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

  const isNew = useMemo(
    () => moment().diff(moment(value.created_at), "days") < MAX_DAY_NEW_THEME,
    [value.created_at],
  );

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
        result = { image: ListMode, color: green["A400"] };
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
        <BadgeNew isNew={isNew} />
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
