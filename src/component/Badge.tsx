import { Box, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  value: string;
}
export const BadgeDifficulty = ({ value }: Props) => {
  const { t } = useTranslation();

  const getColor = useCallback(() => {
    let color: string = Colors.black;
    if (value === "FACILE") {
      color = Colors.green;
    } else if (value === "MOYEN") {
      color = Colors.orange;
    } else if (value === "DIFFICILE") {
      color = Colors.red;
    }
    return color;
  }, [value]);

  return (
    <Box
      sx={{
        p: padding(2, 8),
        backgroundColor: getColor(),
        borderRadius: px(10),
        width: "fit-content",
      }}
    >
      <Typography variant="h4" sx={{ color: "white" }}>
        {t(`enum.difficulty.${value}`)}
      </Typography>
    </Box>
  );
};
