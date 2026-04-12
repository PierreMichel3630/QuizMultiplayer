import { Typography, TypographyVariant } from "@mui/material";
import { useMemo } from "react";
import { Order } from "src/models/enum/Order";
import { Colors } from "src/style/Colors";

enum Variation {
  LOWER = "LOWER",
  UPPER = "UPPER",
  EGAL = "EGAL",
}
interface Props {
  previous: number;
  value: number;
  unit?: string;
  order?: Order;
  variant?:TypographyVariant
}
export const ChangeNumberBlock = ({
  previous,
  value,
  order = Order.ASC,
  unit = "",
  variant="h2"
}: Props) => {
  const variation = useMemo(() => {
    if (value === previous) {
      return {
        label: "=",
        variation: Variation.EGAL,
      };
    } else {
      if (order === Order.ASC) {
        return value > previous
          ? {
              label: `+${(value - previous).toFixed(0)}${unit}`,
              variation: Variation.UPPER,
            }
          : {
              label: `${(value - previous).toFixed(0)}${unit}`,
              variation: Variation.LOWER,
            };
      } else {
        return value < previous
          ? {
              label: `${(value - previous).toFixed(0)}${unit}`,
              variation: Variation.UPPER,
            }
          : {
              label: `+${(value - previous).toFixed(0)}${unit}`,
              variation: Variation.LOWER,
            };
      }
    }
  }, [previous, value, unit, order]);

  const color = useMemo(() => {
    let result: string = Colors.yellow;
    if (variation.variation === Variation.UPPER) {
      result = Colors.correctanswer;
    } else if (variation.variation === Variation.LOWER) {
      result = Colors.wronganswer;
    }
    return result;
  }, [variation.variation]);

  return (
    <Typography
      variant={variant}
      sx={{
        color: color,
      }}
    >
      {variation.label}
    </Typography>
  );
};
