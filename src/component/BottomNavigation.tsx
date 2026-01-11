import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { padding, px } from "csx";
import { useRealtime } from "src/context/NotificationProvider";
import { LogoIconRound } from "src/icons/LogoIcon";
import { NotificationType } from "src/models/enum/NotificationType";
import { Colors } from "src/style/Colors";

export const BottomNavigationBlock = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useRealtime();

  const [menu, setMenu] = useState(location.pathname.split("/")[1]);

  useEffect(() => {
    setMenu(location.pathname.split("/")[1]);
  }, [location.pathname]);

  const notificationsAccomplishment = useMemo(
    () =>
      [...notifications].filter(
        (el) =>
          el.isread === false &&
          el.type === NotificationType.accomplishment_unlock
      ).length,
    [notifications]
  );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderTop: `2px solid ${Colors.lightgrey}`,
        pb: "calc(env(safe-area-inset-bottom, 0px))",
        backgroundColor: "background.paper",
      }}
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
              <MilitaryTechIcon />
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
          value={"menus"}
          label={t("commun.menus")}
          icon={<MenuIcon />}
          component={Link}
          to={"/menus"}
        />
      </BottomNavigation>
      <Box
        sx={{
          p: px(5),
          position: "absolute",
          left: "50%",
          transform: "translate(-40%, -100%)",
          cursor: "pointer",
          bgcolor: "background.paper",
          borderRadius: "50%",
        }}
        onClick={() => navigate("/play")}
      >
        <LogoIconRound />
      </Box>
      <Box
        sx={{
          p: px(5),
          position: "absolute",
          left: "50%",
          transform: "translate(-40%, -100%)",
          cursor: "pointer",
          bgcolor: "background.paper",
          borderRadius: "50%",
          border: `2px solid ${Colors.lightgrey}`,
          zIndex: -1,
        }}
        onClick={() => navigate("/play")}
      >
        <Box
          sx={{
            width: px(60),
            height: px(60),
            borderRadius: "50%",
          }}
        ></Box>
      </Box>
    </Box>
  );
};
