import { Box, Button, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";
import { useRegisterSW } from "virtual:pwa-register/react";

export const UpdateNotificationBlock = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl) {
      console.log(`Service Worker at: ${swUrl}`);
      navigate("/news");
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onNeedRefresh() {
      setNeedRefresh(true);
    },
  });

  const updateApp = () => {
    updateServiceWorker();
    setNeedRefresh(false);
  };

  return (
    needRefresh && (
      <Paper
        sx={{
          p: px(5),
          width: percent(99),
          backgroundColor: Colors.black,
          border: "2px solid white",
          borderRadius: px(5),
          zIndex: 1500,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">
            {t("commun.newversionavailable")}
          </Typography>
          <Button size="large" onClick={updateApp}>
            <Typography variant="h4" color="text.secondary">
              {t("commun.install")}
            </Typography>
          </Button>
        </Box>
      </Paper>
    )
  );
};
