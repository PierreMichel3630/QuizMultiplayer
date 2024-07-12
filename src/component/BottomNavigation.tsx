import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Fab,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import { padding, px } from "csx";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";
import { FRIENDSTATUS } from "src/models/Friend";
import { LogoIcon } from "src/icons/LogoIcon";

export const BottomNavigationBlock = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const { friends } = useApp();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(location.pathname.split("/")[1]);

  const notifications = useMemo(
    () =>
      friends.filter(
        (el) =>
          el.status === FRIENDSTATUS.PROGRESS && user && user.id !== el.user1.id
      ).length,
    [friends, user]
  );

  useEffect(() => {
    setMenu(location.pathname.split("/")[1]);
  }, [location.pathname]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
      elevation={24}
    >
      <BottomNavigation
        showLabels
        value={menu}
        onChange={(_, newValue) => {
          setMenu(newValue);
        }}
      >
        <BottomNavigationAction
          sx={{ p: padding(0, 5), minWidth: px(30) }}
          value={""}
          label={t("commun.themes")}
          icon={<AppsIcon />}
          component={Link}
          to={"/"}
        />
        <BottomNavigationAction
          sx={{ p: padding(0, 5), minWidth: px(30) }}
          value={"people"}
          label={t("commun.people")}
          icon={<GroupsIcon />}
          component={Link}
          to={"/people"}
        />
        <BottomNavigationAction sx={{ width: px(50) }} />
        <BottomNavigationAction
          sx={{ p: padding(0, 5), minWidth: px(30) }}
          value={"profil"}
          label={t("commun.profile")}
          icon={<AccountCircleIcon />}
          component={Link}
          to={user ? `/profil/${user.id}` : "/login"}
        />
        <BottomNavigationAction
          sx={{ p: padding(0, 5), minWidth: px(30) }}
          value={"menu"}
          label={t("commun.menus")}
          component={Link}
          icon={
            <Badge badgeContent={notifications} color="error">
              <MenuIcon />
            </Badge>
          }
          to={"/menu"}
        />
      </BottomNavigation>
      <Box
        sx={{
          p: 1,
          backgroundColor: Colors.white,
          borderRadius: "50%",
          position: "absolute",
          left: "50%",
          transform: "translate(-40%, -100%)",
          cursor: "pointer",
        }}
        onClick={() => navigate("/play")}
      >
        <Fab color="secondary">
          <LogoIcon
            sx={{ color: Colors.white, ml: "2px", mt: "3px", fontSize: 30 }}
          />
        </Fab>
      </Box>
    </Paper>
  );
};
