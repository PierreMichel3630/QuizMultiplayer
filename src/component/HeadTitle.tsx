import { Box, Typography } from "@mui/material";
import { percent } from "csx";
import head from "src/assets/head.png";

interface Props {
  title: string;
}
export const HeadTitle = ({ title }: Props) => {
  return (
    <Box sx={{ position: "relative" }}>
      <img src={head} style={{ width: percent(100) }} />
      <Box
        sx={{
          position: "absolute",
          top: percent(50),
          left: percent(50),
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          color="text.secondary"
          sx={{ minWidth: "auto" }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
