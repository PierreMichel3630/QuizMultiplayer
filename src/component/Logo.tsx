import BoltIcon from "@mui/icons-material/Bolt";
import { Box } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

export const Logo = () => {
  return (
    <Box
      sx={{
        border: `5px solid ${Colors.purple}`,
        borderRadius: percent(50),
        backgroundColor: "white",
      }}
    >
      <BoltIcon sx={{ width: px(40), height: px(40) }} />
    </Box>
  );
};
