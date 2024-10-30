import { Box, Skeleton } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useState } from "react";

interface Props {
  src: string;
  border?: boolean;
}

export const ImageQuestionBlock = ({ src, border = false }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const image = new Image();

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
        flexGrow: 1,
        flex: "1 1 0",
      }}
    >
      {isLoading ? (
        <>
          <Skeleton
            variant="rectangular"
            sx={{ bgcolor: "grey.800" }}
            width={"90%"}
            height={200}
          />
        </>
      ) : (
        <>
          {border ? (
            <img
              src={src}
              data-src={src}
              loading="lazy"
              style={{
                maxHeight: percent(100),
                maxWidth: percent(100),
                objectFit: "contain",
                border: "1px solid white",
              }}
            />
          ) : (
            <img
              src={src}
              data-src={src}
              loading="lazy"
              style={{
                maxHeight: percent(100),
                maxWidth: percent(100),
                objectFit: "contain",
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};

interface PropsImageQCMBlock {
  src: string;
  width?: number;
  border?: boolean;
}

export const ImageQCMBlock = ({
  src,
  width = 200,
  border = false,
}: PropsImageQCMBlock) => {
  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        flex: "1 1 0",
        maxHeight: px(width),
      }}
    >
      {border ? (
        <img
          src={src}
          style={{
            maxHeight: percent(95),
            maxWidth: percent(95),
            objectFit: "contain",
            border: "1px solid white",
          }}
        />
      ) : (
        <img
          src={src}
          style={{
            height: percent(95),
            width: percent(95),
            objectFit: "contain",
          }}
        />
      )}
    </Box>
  );
};
