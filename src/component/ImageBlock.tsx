import { Box, Skeleton } from "@mui/material";
import { percent, viewHeight } from "csx";
import { useState } from "react";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: viewHeight(20),
});

interface Props {
  src: string;
}

export const ImageQuestionBlock = ({ src }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box sx={{ p: 1, backgroundColor: Colors.lightgrey }}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          sx={{ bgcolor: "grey.400" }}
          animation="wave"
          width={200}
          height={200}
        />
      )}
      <img
        src={src}
        className={imageCss}
        style={{
          display: isLoading ? "none" : "block",
        }}
        onLoad={() => setIsLoading(false)}
      />
    </Box>
  );
};
