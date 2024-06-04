import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { important, px } from "csx";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import logo from "src/assets/logo.svg";
import { useAuth } from "src/context/AuthProviderSupabase";
import { AccountMenu } from "./AccountMenu";
import { LanguagesMenu } from "./LanguageMenu";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SoundMenu } from "./SoundMenu";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, pl: 1, pr: 1 }}>
      <AppBar position="fixed" color="secondary">
        <Container
          maxWidth="lg"
          sx={{ pl: important(px(5)), pr: important(px(5)) }}
        >
          <Toolbar id="toolbar" sx={{ p: important(px(0)), gap: px(8) }}>
            <Link
              to="/"
              style={{
                display: "flex",
                gap: px(10),
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img src={logo} width={45} height={45} />
              <Typography
                variant="h1"
                sx={{ fontSize: 30, display: { xs: "none", sm: "flex" } }}
              >
                {t("appname")}
              </Typography>
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <SoundMenu />
              <LanguagesMenu />
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <Box>
                  <Button
                    endIcon={<AccountCircleIcon />}
                    onClick={() => navigate("login")}
                    variant="contained"
                  >
                    <Typography variant="body1">{t("commun.login")}</Typography>
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
