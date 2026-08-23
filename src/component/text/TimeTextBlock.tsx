import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { millisecondsToSeconds } from "src/utils/convert";

interface Props {
  title: string;
  value: number;
}

export const TimeMSTextBlock = ({ title, value }: Props) => {
  return (
    <Box>
      <Typography variant="caption">{title}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 12 }}>
        {millisecondsToSeconds(value)}
      </Typography>
    </Box>
  );
};
