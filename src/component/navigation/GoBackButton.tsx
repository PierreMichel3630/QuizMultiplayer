import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTranslation } from "react-i18next";

interface Props {
  to?: string;
}
export const GoBackButton = ({ to }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBackIosIcon />}
      onClick={() => navigate(to ? to : -1)}
      sx={{ color: "text.primary" }}
    >
      <Typography variant="h6" color="text.primary">
        {t("commun.back")}
      </Typography>
    </Button>
  );
};

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
