import { Box, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { important, px } from "csx";
import moneyIcon from "src/assets/money.svg";

interface Props {
  money: number | string;
  variant?: Variant;
  color?: string;
  width?: number;
  fontSize?: number;
}

export const MoneyBlock = ({
  money,
  variant = "h4",
  color = "text.secondary",
  width = 18,
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: px(5), alignItems: "center" }}>
      <Typography variant={variant} color={color}>
        {money.toLocaleString("fr-FR")}
      </Typography>
      <img alt="money logo" src={moneyIcon} width={width} />
    </Box>
  );
};

export const AddMoneyBlock = ({
  money,
  variant = "h2",
  color = "text.primary",
  width = 25,
  fontSize,
}: Props) => {
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
        + {money}
      </Typography>
      <img alt="money logo" src={moneyIcon} width={width} loading="lazy" />
    </Box>
  );
};
