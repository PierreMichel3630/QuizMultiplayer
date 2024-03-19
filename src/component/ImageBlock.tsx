import { Box } from "@mui/material";
import { percent, viewHeight } from "csx";
import { style } from "typestyle";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: viewHeight(30),
});

interface Props {
  src: string;
}

export const ImageQuestionBlock = ({ src }: Props) => {
  return (
    <Box>
      <img src={src} className={imageCss} />
    </Box>
  );
};
