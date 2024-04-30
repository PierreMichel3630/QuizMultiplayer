import { Box } from "@mui/material";
import { percent } from "csx";

interface Props {
  src: string;
}

export const ImageQuestionBlock = ({ src }: Props) => {
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
      <img
        src={src}
        style={{
          maxHeight: percent(100),
          maxWidth: percent(100),
          border: "1px solid white",
        }}
      />
    </Box>
  );
};
