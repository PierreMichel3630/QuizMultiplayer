import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { Fragment, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CountryBlock } from "src/component/CountryBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import BrushIcon from "@mui/icons-material/Brush";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SettingsIcon from "@mui/icons-material/Settings";
import { useApp } from "src/context/AppProvider";
import { FRIENDSTATUS } from "src/models/Friend";

interface Menu {
  value: string;
  label: string;
  icon: JSX.Element;
  to: string;
  state?: unknown;
}

export const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { friends } = useApp();
  const { user, profile, logout } = useAuth();

  const notifications = useMemo(
    () => friends.filter((el) => el.status === FRIENDSTATUS.PROGRESS).length,
    [friends]
  );

  const menus: Array<Menu> = useMemo(
    () => [
      {
        value: "",
        label: t("commun.themes"),
        icon: <AppsIcon />,
        to: "/",
      },
      {
        value: "people",
        label: t("commun.people"),
        icon: <GroupsIcon />,
        to: "/people",
      },
      {
        value: "profil",
        label: t("commun.profile"),
        icon: <AccountCircleIcon />,
        to: user ? `/profil/${user.id}` : "/login",
      },
      {
        value: "ranking",
        label: t("commun.ranking"),
        icon: <BarChartIcon />,
        to: "/ranking",
      },
      {
        value: "report",
        label: t("commun.reportpropose"),
        icon: <ReportProblemIcon />,
        to: "/report",
      },
    ],
    [t, user]
  );

  const menusUser: Array<Menu> = useMemo(
    () => [
      {
        value: "personalized",
        label: t("commun.personalizedprofile"),
        icon: <BrushIcon />,
        to: "/personalized",
      },
      {
        value: "accomplishments",
        label: t("commun.myaccomplishments"),
        icon: <EmojiEventsIcon />,
        to: "/accomplishments",
      },
      {
        label: t("commun.compare"),
        icon: <CompareArrowsIcon />,
        value: "compare",
        to: "/compare",
        state: { profile1: profile },
      },
      {
        value: "notifications",
        label: t("commun.notifications"),
        icon: (
          <Badge badgeContent={notifications} color="error">
            <NotificationsIcon />
          </Badge>
        ),
        to: "/notifications",
      },
      {
        value: "parameter",
        label: t("commun.myparameter"),
        icon: <SettingsIcon />,
        to: "/parameter",
      },
    ],
    [notifications, profile, t]
  );

  const allMenu = useMemo(
    () => (user ? [...menusUser, ...menus] : menus),
    [user, menus, menusUser]
  );

  const disconnect = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box>
      <Helmet>
        <title>{`${t("pages.menu.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
        {user && profile ? (
          <Box
            sx={{
              p: 1,
              backgroundColor: "#4158D0",
              backgroundImage:
                "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
              position: "relative",
              width: percent(100),
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              <Grid item>
                <AvatarAccountBadge
                  profile={profile}
                  size={120}
                  color={Colors.white}
                  backgroundColor={Colors.grey2}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography variant="h2" color="text.secondary">
                  {profile.username}
                </Typography>
                {profile.title && (
                  <JsonLanguageBlock
                    variant="caption"
                    color="text.secondary"
                    value={profile.title.name}
                  />
                )}
              </Grid>
              {profile.country && (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <CountryBlock id={profile.country} color="text.secondary" />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderRadius: px(50),
                    backgroundColor: Colors.white,
                  }}
                  onClick={disconnect}
                >
                  {t("commun.logout")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography variant="h1" sx={{ fontSize: 30 }}>
            {t("commun.menus")}
          </Typography>
        )}
        <Grid item xs={12}>
          <List>
            <Divider />
            {allMenu.map((menu, index) => (
              <Fragment key={index}>
                <ListItem
                  disablePadding
                  onClick={() =>
                    navigate(menu.to, {
                      state: menu.state,
                    })
                  }
                  sx={{ backgroundColor: Colors.white }}
                >
                  <ListItemButton>
                    <ListItemIcon>{menu.icon}</ListItemIcon>
                    <ListItemText primary={menu.label} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};
