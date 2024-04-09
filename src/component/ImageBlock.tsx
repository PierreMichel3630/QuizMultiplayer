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
        backgroundImage: `url(${src})`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};
