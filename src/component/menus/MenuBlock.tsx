import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import BrushIcon from "@mui/icons-material/Brush";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EditIcon from "@mui/icons-material/Edit";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HelpIcon from "@mui/icons-material/Help";
import HistoryIcon from "@mui/icons-material/History";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import PeopleIcon from "@mui/icons-material/People";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SettingsIcon from "@mui/icons-material/Settings";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import {
  Badge,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppBar } from "src/context/AppBarProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useRealtime } from "src/context/NotificationProvider";
import { NotificationType } from "src/models/enum/NotificationType";
import { NotificationBadgeIcon } from "../button/NotificationBadge";
import NoteIcon from "@mui/icons-material/Note";

interface MenuTitle {
  title: string;
  menus: Array<Menu>;
}

interface Menu {
  value: string;
  label: string;
  icon: JSX.Element;
  to: string;
  state?: unknown;
}

interface Props {
  open?: boolean;
}

export const MenuBlock = ({ open = true }: Props) => {
  const { t } = useTranslation();
  const { notifications } = useRealtime();
  const { profile } = useAuth();

  const notificationsAccomplishment = useMemo(
    () =>
      [...notifications].filter(
        (el) =>
          el.isread === false &&
          el.type === NotificationType.accomplishment_unlock
      ).length,
    [notifications]
  );

  const menuTree: Array<MenuTitle> = useMemo(() => {
    const menuGlobal = {
      title: t("commun.global"),
      menus: [
        {
          value: "themes",
          label: t("commun.themes"),
          icon: <AppsIcon fontSize="large" />,
          to: "/",
        },
        {
          value: "challenge",
          label: t("commun.daychallenge"),
          icon: <EmojiEventsIcon fontSize="large" />,
          to: "/challenge",
        },
        {
          value: "ranking",
          label: t("commun.ranking"),
          icon: <BarChartIcon fontSize="large" />,
          to: "/ranking",
        },
        {
          value: "accomplishments",
          label: t("commun.accomplishments"),
          icon: <MilitaryTechIcon fontSize="large" />,
          to: "/accomplishments",
        },
        {
          value: "parameters",
          label: t("commun.parameters"),
          icon: <SettingsIcon fontSize="large" />,
          to: "/parameters",
        },
      ],
    };

    const menuAccount = {
      title: t("commun.account"),
      menus: [
        {
          value: "friends",
          label: t("commun.myfriends"),
          icon: <PeopleIcon fontSize="large" />,
          to: "/people",
        },
        {
          value: "notifications",
          label: t("commun.notifications"),
          icon: <NotificationBadgeIcon />,
          to: "/notifications",
        },
        {
          value: "personalized",
          label: t("commun.personalizedprofile"),
          icon: <BrushIcon fontSize="large" />,
          to: "/personalized",
        },
        {
          value: "statistical",
          label: t("commun.mystatistics"),
          icon: <PieChartIcon fontSize="large" />,
          to: profile ? `/profil/${profile.id}` : "/login",
        },
        {
          value: "accomplishments",
          label: t("commun.myaccomplishments"),
          icon: (
            <Badge badgeContent={notificationsAccomplishment} color="error">
              <MilitaryTechIcon fontSize="large" />
            </Badge>
          ),
          to: `/accomplishments`,
        },
        {
          value: "proposals",
          label: t("commun.myproposals"),
          icon: <EditIcon fontSize="large" />,
          to: profile ? `/myproposals` : "/login",
        },
        {
          value: "history",
          label: t("commun.mygames"),
          icon: <HistoryIcon fontSize="large" />,
          to: profile ? `/games` : "/login",
          state: profile ? { player: profile } : undefined,
        },
        {
          label: t("commun.compare"),
          icon: <CompareArrowsIcon fontSize="large" />,
          value: "compare",
          to: "/compare",
          state: { profile1: profile },
        },
      ],
    };

    const menuHelp = {
      title: t("commun.helpregulations"),
      menus: [
        {
          value: "help",
          label: t("commun.help"),
          icon: <HelpIcon fontSize="large" />,
          to: "/help",
        },
        {
          value: "installation",
          label: t("commun.installation"),
          icon: <InstallMobileIcon fontSize="large" />,
          to: "/installation",
        },
        {
          value: "report",
          label: t("commun.reportproblem"),
          icon: <ReportProblemIcon fontSize="large" />,
          to: "/report",
        },
        {
          value: "patchnote",
          label: t("commun.patchnote"),
          icon: <NoteIcon fontSize="large" />,
          to: "/news",
        },
      ],
    };
    return profile
      ? [menuGlobal, menuAccount, menuHelp]
      : [menuGlobal, menuHelp];
  }, [notificationsAccomplishment, profile, t]);

  return (
    <Box sx={{ mt: 3 }}>
      {open ? (
        <>
          {menuTree.map((el, index) => (
            <Grid container spacing={1} key={index}>
              {index > 0 && (
                <Grid size={12}>
                  <Divider />
                </Grid>
              )}
              <Grid size={12} sx={{ pt: 1, pl: 1, pr: 1 }}>
                <Typography variant="h4">{el.title}</Typography>
                <List>
                  {[...el.menus].map((menu, i) => (
                    <MenuItem key={i} menu={menu} />
                  ))}
                </List>
              </Grid>
            </Grid>
          ))}
        </>
      ) : (
        <>
          {menuTree.map((el, index) => (
            <Grid container spacing={1} key={index}>
              <Grid size={12}>
                <List>
                  {[...el.menus].map((menu, i) => (
                    <MenuItem key={i} menu={menu} />
                  ))}
                </List>
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </Box>
  );
};

interface PropsMenuItem {
  menu: Menu;
}
const MenuItem = ({ menu }: PropsMenuItem) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openDrawer } = useAppBar();

  const isSelected = useMemo(
    () =>
      location.pathname === menu.to ||
      location.pathname.startsWith(menu.to + "/"),
    [menu, location]
  );

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        sx={
          openDrawer
            ? {}
            : {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }
        }
        onClick={() =>
          navigate(menu.to, {
            state: menu.state,
          })
        }
      >
        <ListItemIcon sx={openDrawer ? {} : { minWidth: "inherit" }}>
          {menu.icon}
        </ListItemIcon>
        <ListItemText
          sx={openDrawer ? {} : { textAlign: "center" }}
          primary={
            <Typography variant={openDrawer ? "body1" : "caption"}>
              {menu.label}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
