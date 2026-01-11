import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { VERSION_APP } from "src/utils/config";
import { UpdateAppButton } from "./button/UpdateAppButton";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const UpdateAppVersionBlock = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="h4">{t("commun.appversion")}</Typography>
          <Typography variant="body1" sx={{ fontSize: 15 }}>
            {VERSION_APP}
          </Typography>
        </Box>
        <InfoOutlinedIcon />
      </Box>
      <UpdateAppButton />
    </Box>
  );
};
