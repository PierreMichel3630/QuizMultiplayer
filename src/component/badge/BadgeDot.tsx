import { Box } from "@mui/system";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

export const BadgeDot = () => (
  <Box
    sx={{
      backgroundColor: Colors.red,
      borderRadius: percent(50),
      width: px(8),
      height: px(8),
    }}
  />
);
