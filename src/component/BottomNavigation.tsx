import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { important, padding, px } from "csx";
import { useApp } from "src/context/AppProvider";
import { LogoIcon } from "src/icons/LogoIcon";
import { Colors } from "src/style/Colors";

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
          sx={{
            p: padding(0, 5),
            minWidth: px(30),
            fontSize: important(px(10)),
          }}
          value={"myprofile"}
          label={t("commun.profile")}
          icon={<AccountCircleIcon />}
          component={Link}
          to={"/myprofile"}
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
        <Box
          sx={{
            backgroundColor: Colors.colorApp,
            width: px(60),
            height: px(60),
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LogoIcon
            sx={{ color: Colors.white, ml: "2px", mt: "3px", fontSize: 40 }}
          />
        </Box>
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
