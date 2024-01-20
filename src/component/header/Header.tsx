import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { important, px } from "csx";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import logo from "src/assets/logo.png";
import { LanguagesMenu } from "./LanguageMenu";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1, pl: 1, pr: 1 }}>
      <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
        <Toolbar id="toolbar" sx={{ p: important(px(0)), gap: px(8) }}>
          <Link
            to="/"
            style={{ display: "flex", gap: px(10), alignItems: "center" }}
          >
            <img src={logo} width={50} height={50} />
            <Typography
              variant="h1"
              sx={{ fontSize: 30, display: { xs: "none", sm: "flex" } }}
            >
              {t("appname")}
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <LanguagesMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
