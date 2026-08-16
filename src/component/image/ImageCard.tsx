import { Box } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";
import { BadgeNew } from "../badge/BadgeNew";
import { SearchType } from "src/models/enum/TypeCardEnum";

import BoltIcon from "@mui/icons-material/Bolt";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import ListMode from "src/assets/mode/list.png";

interface ImageCardValue {
  image?: string | JSX.Element;
  color?: string;
  created_at?: Date;
}

interface ImageTypeCardProps {
  type: SearchType;
  value: ImageCardValue;
  size?: string | number;
}

export const ImageTypeCard = ({ type, value, size }: ImageTypeCardProps) => {
  const valueImageCard = useMemo(() => {
    let result: ImageCardValue = {
      image: value.image,
      color: value.color,
      created_at: value.created_at,
    };
    switch (type) {
      case SearchType.LIST:
        result = {
          image: ListMode,
          color: Colors.colorList,
          created_at: value.created_at,
        };
        break;
      case SearchType.GAME:
        result = {
          image: value.image,
          color: Colors.colorBrainTest,
          created_at: value.created_at,
        };
        break;
      case SearchType.CATEGORY:
        result = {
          image: (
            <BoltIcon
              sx={{
                width: percent(80),
                height: percent(80),
                color: "white",
              }}
            />
          ),
          color: Colors.colorApp,
          created_at: value.created_at,
        };
        break;
      case SearchType.GAMEMODE:
      case SearchType.THEME:
        result = {
          image: value.image,
          color: value.color,
          created_at: value.created_at,
        };
        break;
    }
    return result;
  }, [type, value]);

  return <ImageCard value={valueImageCard} size={size} />;
};

interface ImageCardProps {
  value: ImageCardValue;
  size?: string | number;
}

const ImageCard = ({ value, size = percent(100) }: ImageCardProps) => {
  const { mode } = useUser();

  const borderColor = useMemo(
    () => (mode === "dark" ? Colors.white : Colors.black),
    [mode],
  );

  return (
    <Box
      sx={{
        backgroundColor: value.color ?? Colors.colorApp,
        width: size,
        height: size,
        aspectRatio: "1/1",
        borderRadius: px(10),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid",
        borderColor,
        position: "relative",
      }}
    >
      {value.created_at && (
        <BadgeNew
          date={value.created_at}
          fontSize={Number.isFinite(size) ? Number(size) / 9 : 10}
        />
      )}
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
        (value.image ?? (
          <NoPhotographyIcon
            sx={{
              width: percent(80),
              height: percent(80),
              color: "white",
            }}
          />
        ))
      )}
    </Box>
  );
};
