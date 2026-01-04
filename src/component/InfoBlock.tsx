import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

interface Props {
  title: string;
  value?: number | string;
  content?: JSX.Element;
}

export const InfoBlock = ({ title, value, content }: Props) => {
  const { mode } = useUser();

  const color = useMemo(
    () => (mode === "dark" ? Colors.lightgrey2 : Colors.grey5),
    [mode]
  );

  return (
    <Box sx={{ p: px(2), textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          color: color,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      {value !== undefined && <Typography variant="h2">{value}</Typography>}
      {content !== undefined && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>{content}</Box>
      )}
    </Box>
  );
};
