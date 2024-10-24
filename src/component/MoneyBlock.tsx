import { Box, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import moneyIcon from "src/assets/money.svg";

interface Props {
  money: number;
  variant?: Variant;
  color?: string;
}

export const MoneyBlock = ({
  money,
  variant = "h4",
  color = "text.secondary",
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 1, alignContent: "center" }}>
      <Typography variant={variant} color={color}>
        {money.toLocaleString("fr-FR")}
      </Typography>
      <img src={moneyIcon} width={18} loading="lazy" />
    </Box>
  );
};

export const AddMoneyBlock = ({
  money,
  variant = "h2",
  color = "text.secondary",
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 1, alignContent: "center" }}>
      <Typography variant={variant} color={color}>
        + {money}
      </Typography>
      <img src={moneyIcon} width={25} loading="lazy" />
    </Box>
  );
};
