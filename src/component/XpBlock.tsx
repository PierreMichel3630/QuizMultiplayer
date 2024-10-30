import { Box, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { px } from "csx";

interface Props {
  xp: number;
  variant?: Variant;
  color?: string;
}

export const AddXpBlock = ({
  xp,
  variant = "h4",
  color = "text.secondary",
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: px(2), alignContent: "center" }}>
      <Typography variant={variant} color={color} noWrap>
        + {xp}
      </Typography>
      <Typography variant="body1" color={color}>
        xp
      </Typography>
    </Box>
  );
};
