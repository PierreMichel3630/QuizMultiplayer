import { Typography } from "@mui/material";
import { useMemo } from "react";
import { Colors } from "src/style/Colors";
export enum Order {
  DESC = "DESC",
  ASC = "ASC",
}
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
}
export const ChangeNumberBlock = ({
  previous,
  value,
  order = Order.ASC,
  unit = "",
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
      variant="h2"
      sx={{
        color: color,
      }}
    >
      {variation.label}
    </Typography>
  );
};
