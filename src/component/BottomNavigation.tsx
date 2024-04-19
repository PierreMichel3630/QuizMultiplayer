import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Fab,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BoltIcon from "@mui/icons-material/Bolt";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

export const BottomNavigationBlock = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(location.pathname.split("/")[1]);

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
          value={""}
          label={t("commun.themes")}
          icon={<AppsIcon />}
          component={Link}
          to={"/"}
        />
        <BottomNavigationAction
          value={"people"}
          label={t("commun.people")}
          icon={<GroupsIcon />}
          component={Link}
          to={"/people"}
        />
        <BottomNavigationAction value={""} label={"ddd"} />

        <BottomNavigationAction
          value={"profil"}
          label={t("commun.profile")}
          icon={<AccountCircleIcon />}
          component={Link}
          to={user ? `/profil/${user.id}` : "/login"}
        />
        <BottomNavigationAction
          value={"notifications"}
          label={t("commun.notifications")}
          icon={<NotificationsIcon />}
          component={Link}
          to={"/notifications"}
        />
        <Box
          sx={{
            p: 1,
            backgroundColor: Colors.white,
            borderRadius: "50%",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -20%)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/play")}
        >
          <Fab color="secondary">
            <BoltIcon fontSize="large" sx={{ color: Colors.white }} />
          </Fab>
        </Box>
      </BottomNavigation>
    </Paper>
  );
};
