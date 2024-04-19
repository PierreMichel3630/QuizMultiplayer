import { Box } from "@mui/material";
import { percent, viewHeight } from "csx";

interface Props {
  src: string;
}

export const ImageQuestionBlock = ({ src }: Props) => {
  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        maxHeight: viewHeight(50),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={src}
        style={{
          maxWidth: percent(95),
          maxHeight: percent(95),
          border: "2px solid white",
        }}
      />
    </Box>
  );
};
