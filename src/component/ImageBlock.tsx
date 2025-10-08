import { Box, Skeleton } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useState } from "react";
import { Colors } from "src/style/Colors";

interface Props {
  src: string;
}

export const ImageQuestionBlock = ({ src }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasBorder, setHasBorder] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const image = new Image();
    setHasBorder(src.includes("https://flagcdn.com/"));

    image.onload = () => {
      setIsLoading(false);
    };

    image.src = src;

    return () => {
      image.onload = () => {};
    };
  }, [src]);

  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          sx={{ bgcolor: "grey.800" }}
          width={"90%"}
          height={200}
        />
      ) : (
        <img
          alt="question visual"
          src={src}
          data-src={src}
          loading="lazy"
          style={{
            maxHeight: percent(100),
            maxWidth: percent(100),
            objectFit: "contain",
            backgroundColor: Colors.grey2,
            borderRadius: px(10),
            padding: px(5),
            outline: hasBorder ? "1px solid black" : "none",
            outlineOffset: "-5px",
          }}
        />
      )}
    </Box>
  );
};

interface PropsImageQCMBlock {
  src: string;
  width?: number;
}

export const ImageQCMBlock = ({ src, width = 200 }: PropsImageQCMBlock) => {
  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        maxHeight: width ? px(width) : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 1,
        mb: 1,
      }}
    >
      <img
        src={src}
        style={{
          height: percent(95),
          width: percent(95),
          objectFit: "contain",
          maxHeight: "inherit",
        }}
      />
    </Box>
  );
};

interface PropsImageQCMBlock {
  src: string;
  width?: number;
}
export const ImageQuestionAdminBlock = ({
  src,
  width = 100,
}: PropsImageQCMBlock) => {
  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        maxHeight: width ? px(width) : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 1,
        mb: 1,
      }}
    >
      <img
        src={src}
        style={{
          height: percent(95),
          width: percent(95),
          objectFit: "contain",
          maxHeight: "inherit",
        }}
      />
    </Box>
  );
};
