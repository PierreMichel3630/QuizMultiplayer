import { Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface Props {
  value: number;
}

export const WinBlock = ({ value }: Props) => {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
    >
      <Typography variant="h2">{value}</Typography>
      <EmojiEventsIcon />
    </Box>
  );
};
