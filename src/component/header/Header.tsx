import { Box, IconButton, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { px } from "csx";
import logo from "src/assets/logo.svg";
import { useAppBar } from "src/context/AppBarProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { SearchBar } from "../search/SearchBar";
import { HeaderProfileBarMobile } from "./HeaderProfileBarMobile";
import { StreakBlock } from "../StreakBlock";
import { NotificationBadgeIcon } from "../button/NotificationBadge";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toogleOpenDrawer } = useAppBar();
  const { user, streak } = useAuth();
  const isMobileOrTablet = useIsMobileOrTablet();

  return (
    <Box
      sx={{
        flex: 1,
      }}
    >
      {isMobileOrTablet ? (
        <>
          {user ? (
            <HeaderProfileBarMobile />
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: px(5),
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: px(2),
                  alignItems: "center",
                  textDecoration: "none",
                }}
                component={Link}
                to="/"
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
              <NoConnectBar />
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton aria-label="menu" onClick={toogleOpenDrawer}>
              <MenuIcon fontSize="large" />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                gap: px(2),
                alignItems: "center",
                textDecoration: "none",
              }}
              component={Link}
              to="/"
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
          </Box>
          <Box
            sx={{
              p: 1,
              display: "flex",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <SearchBar />
          </Box>
          {user === null ? (
            <Box>
              <ButtonColor
                value={Colors.colorApp}
                label={t("commun.login")}
                variant="contained"
                onClick={() => navigate("/login")}
                typography="h6"
                fullWidth={false}
              />
            </Box>
          ) : (
            <>
              <Link to={`/notifications`}>
                <NotificationBadgeIcon />
              </Link>
              {streak !== undefined && <StreakBlock value={streak} />}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

const NoConnectBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        p: px(5),
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton
          aria-label="parameters"
          component={Link}
          to={`/parameters`}
          size="small"
        >
          <SettingsIcon />
        </IconButton>
        <ButtonColor
          value={Colors.colorApp}
          label={t("commun.login")}
          variant="contained"
          onClick={() => navigate("/login")}
          typography="h6"
          fullWidth={false}
        />
      </Box>
    </Box>
  );
};
