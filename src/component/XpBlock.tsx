import { Box, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { important, px } from "csx";

import xpIcon from "src/assets/xp.svg";

interface Props {
  xp: number | string;
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

interface PropsAddXpImageBlock {
  xp: number | string;
  variant?: Variant;
  color?: string;
  width?: number;
  fontSize?: number;
}

export const AddXpImageBlock = ({
  xp,
  variant = "h2",
  color = "text.primary",
  width = 25,
  fontSize,
}: PropsAddXpImageBlock) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant={variant}
        color={color}
        sx={{ fontSize: fontSize ? important(px(fontSize)) : "auto" }}
        noWrap
      >
        + {xp}
      </Typography>
      <img alt="xp logo" src={xpIcon} width={width} loading="lazy" />
    </Box>
  );
};
