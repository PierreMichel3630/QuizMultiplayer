import { Box, Avatar, Typography } from "@mui/material";
import { percent } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  number?: number;
  label: JSX.Element;
}

export const StepBlock = ({ number, label }: Props) => {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: percent(100),
        borderRadius: 2,
        height: percent(100),
        backgroundColor: Colors.blue3,
      }}
    >
      {number && (
        <Avatar sx={{ width: 30, height: 30, backgroundColor: Colors.white }}>
          <Typography variant="h4" color="secondary">
            {number}
          </Typography>
        </Avatar>
      )}
      {label}
    </Box>
  );
};
