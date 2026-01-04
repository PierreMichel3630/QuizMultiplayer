import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { Colors } from "src/style/Colors";

interface Props {
  count: number;
}

export const BadgeCount = ({ count }: Props) => {
  const size = useMemo(
    () =>
      count.toString().length <= 2 ? 25 : 15 + count.toString().length * 5,
    [count]
  );

  return (
    <Box
      sx={{
        backgroundColor: Colors.blue2,
        borderRadius: percent(50),
        width: px(size),
        height: px(size),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {count}
      </Typography>
    </Box>
  );
};
