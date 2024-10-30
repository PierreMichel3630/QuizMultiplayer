import { Box, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import moneyIcon from "src/assets/money.svg";

interface Props {
  money: number;
  variant?: Variant;
  color?: string;
  width?: number;
}

export const MoneyBlock = ({
  money,
  variant = "h4",
  color = "text.secondary",
  width = 18,
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 1, alignContent: "center" }}>
      <Typography variant={variant} color={color}>
        {money.toLocaleString("fr-FR")}
      </Typography>
      <img src={moneyIcon} width={width} loading="lazy" />
    </Box>
  );
};

export const AddMoneyBlock = ({
  money,
  variant = "h2",
  color = "text.secondary",
  width = 25,
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 1, alignContent: "center" }}>
      <Typography variant={variant} color={color} noWrap>
        + {money}
      </Typography>
      <img src={moneyIcon} width={width} loading="lazy" />
    </Box>
  );
};
