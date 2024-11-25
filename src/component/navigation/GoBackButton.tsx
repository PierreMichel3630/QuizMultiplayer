import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CancelIcon from "@mui/icons-material/Cancel";

export const GoHomeButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBackIosIcon />}
      onClick={() => navigate("/")}
      sx={{ color: "text.primary" }}
    >
      <Typography variant="h6" color="text.primary">
        {t("commun.backhome")}
      </Typography>
    </Button>
  );
};

export const GoBackButtonIcon = () => {
  const navigate = useNavigate();

  return (
    <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
      <KeyboardArrowLeftIcon fontSize="large" />
    </Box>
  );
};

export const QuitHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
      <CancelIcon fontSize="large" />
    </Box>
  );
};
