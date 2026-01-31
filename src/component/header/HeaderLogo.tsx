import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import logo from "src/assets/logo.svg";
import { useAppBar } from "src/context/AppBarProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";

export const HeaderLogo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobileOrTablet = useIsMobileOrTablet();
  const { toogleOpenDrawer } = useAppBar();

  const goTo = useCallback(() => {
    if (isMobileOrTablet) {
      toogleOpenDrawer();
    } else {
      navigate("/");
    }
  }, [isMobileOrTablet, navigate, toogleOpenDrawer]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: px(5),
        alignItems: "center",
        textDecoration: "none",
        cursor: "pointer",
      }}
      onClick={goTo}
    >
      <img alt="logo" src={logo} width={25} />
      <Typography
        variant="h4"
        color="text.secondary"
        sx={{ textTransform: "uppercase" }}
      >
        {t("appname")}
      </Typography>
    </Box>
  );
};
