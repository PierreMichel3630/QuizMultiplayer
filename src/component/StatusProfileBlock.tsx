import { Box, Typography } from "@mui/material";
import { px, percent } from "csx";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  online: boolean;
  color?: string;
}

export const StatusProfileBlock = ({ online, color }: Props) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Box
        sx={{
          width: px(18),
          height: px(18),
          borderRadius: percent(50),
          backgroundColor: online ? Colors.green : Colors.red,
          border: "2px solid white",
        }}
      />
      <Typography
        variant="body1"
        sx={{ color: color ? color : online ? Colors.green : Colors.red }}
      >
        {online ? t("commun.online") : t("commun.notonline")}
      </Typography>
    </Box>
  );
};
