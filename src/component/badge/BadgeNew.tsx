import { Box, Typography } from "@mui/material";
import { padding, px, percent } from "csx";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  isNew: boolean;
}
export const BadgeNew = ({ isNew }: Props) => {
  const { t } = useTranslation();
  return (
    isNew && (
      <Box
        sx={{
          position: "absolute",
          p: padding(2, 5),
          borderRadius: px(5),
          backgroundColor: Colors.red,
          top: percent(50),
          left: percent(50),
          transform: "translate(-50%, -50%) rotate(-30deg)",
          transformOrigin: "center",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: px(10) }}>
          {t("commun.new")}
        </Typography>
      </Box>
    )
  );
};
