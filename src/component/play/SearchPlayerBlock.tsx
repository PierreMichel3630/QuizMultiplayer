import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { LoadingDot } from "../Loading";

export const SearchPlayerBlock = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <LoadingDot color={Colors.white} width={40} />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          textShadow: "1px 1px 2px black",
        }}
      >
        {t("commun.searchinprogress")}
      </Typography>
    </Box>
  );
};
