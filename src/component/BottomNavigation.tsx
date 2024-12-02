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
import BarChartIcon from "@mui/icons-material/BarChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { padding, px } from "csx";
import { LogoIcon } from "src/icons/LogoIcon";
import { Colors } from "src/style/Colors";
import { useApp } from "src/context/AppProvider";

export const BottomNavigationBlock = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { myaccomplishments } = useApp();

  const [menu, setMenu] = useState(location.pathname.split("/")[1]);

  useEffect(() => {
    setMenu(location.pathname.split("/")[1]);
  }, [location.pathname]);

  const notificationsAccomplishment = useMemo(
    () => myaccomplishments.filter((el) => !el.validate).length,
    [myaccomplishments]
  );

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
        sx={{
          bgcolor: "background.paper",
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
          value={"accomplishments"}
          label={t("commun.accomplishments")}
          icon={
            <Badge badgeContent={notificationsAccomplishment} color="error">
              <EmojiEventsIcon />
            </Badge>
          }
          component={Link}
          to={`/accomplishments`}
        />
        <BottomNavigationAction sx={{ width: px(50) }} />
        <BottomNavigationAction
          sx={{ p: padding(0, 5), minWidth: px(30) }}
          value={"ranking"}
          label={t("commun.ranking")}
          component={Link}
          icon={<BarChartIcon />}
          to={"/ranking"}
        />
        <BottomNavigationAction
          sx={{ p: padding(0, 5), minWidth: px(30) }}
          value={"myprofile"}
          label={t("commun.profile")}
          icon={<AccountCircleIcon />}
          component={Link}
          to={"/myprofile"}
        />
      </BottomNavigation>
      <Box
        sx={{
          p: 1,
          bgcolor: "background.paper",
          borderRadius: "50%",
          position: "absolute",
          left: "50%",
          transform: "translate(-40%, -100%)",
          cursor: "pointer",
        }}
        onClick={() => navigate("/play")}
      >
        <Fab sx={{ backgroundColor: Colors.blue3 }}>
          <LogoIcon
            sx={{ color: Colors.white, ml: "2px", mt: "3px", fontSize: 30 }}
          />
        </Fab>
      </Box>
    </Paper>
  );
};
