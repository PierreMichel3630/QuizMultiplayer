import { Box } from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import { JsonLanguage } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import StarIcon from "@mui/icons-material/Star";
import { ImageCard } from "../image/ImageCard";
import { useApp } from "src/context/AppProvider";
import { useMemo } from "react";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { useUser } from "src/context/UserProvider";

export interface ICardImage {
  id: number;
  name: JsonLanguage;
  image?: string | JSX.Element;
  color?: string;
  type?: TypeCardEnum;
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
        value.type === TypeCardEnum.THEME
          ? favorite.theme === value.id
          : favorite.category === value.id
      ),
    [favorites, value]
  );

  const goLink = () => {
    if (value.type)
      navigate(
        value.type === TypeCardEnum.THEME
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
      <JsonLanguageBlock
        variant="h6"
        sx={{
          width: percent(100),
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          textAlign: "center",
        }}
        value={value.name}
      />
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
