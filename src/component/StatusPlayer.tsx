import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import CheckIcon from "@mui/icons-material/Check";
import { Colors } from "src/style/Colors";
import { LoadingDot } from "./Loading";

interface Props {
  ready: boolean;
}

export const StatusPlayerGame = ({ ready }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {ready ? (
        <>
          <CheckIcon sx={{ color: Colors.white }} />
          <Typography variant="h6" color="text.secondary">
            {t("commun.ready")}
          </Typography>
        </>
      ) : (
        <>
          <LoadingDot />
          <Typography variant="h6" color="text.secondary">
            {t("commun.wait")}
          </Typography>
        </>
      )}
    </Box>
  );
};
