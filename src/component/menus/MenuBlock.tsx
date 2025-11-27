import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import BrushIcon from "@mui/icons-material/Brush";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SecurityIcon from "@mui/icons-material/Security";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";
import PeopleIcon from "@mui/icons-material/People";
import {
  Badge,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Menu {
  value: string;
  label: string;
  icon: JSX.Element;
  to: string;
  state?: unknown;
}

export const MenuBlock = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { myaccomplishments } = useApp();
  const { user, profile } = useAuth();

  const notificationsAccomplishment = useMemo(
    () => myaccomplishments.filter((el) => !el.validate).length,
    [myaccomplishments]
  );

  const menus: Array<Menu> = useMemo(
    () => [
      {
        value: "themes",
        label: t("commun.themes"),
        icon: <AppsIcon />,
        to: "/",
      },
      {
        value: "ranking",
        label: t("commun.ranking"),
        icon: <BarChartIcon />,
        to: "/ranking",
      },
      {
        value: "accomplishments",
        label: t("commun.accomplishments"),
        icon: <EmojiEventsIcon />,
        to: "/accomplishments",
      },
      {
        value: "faq",
        label: t("commun.faq"),
        icon: <LiveHelpIcon />,
        to: "/faq",
      },
      {
        value: "installation",
        label: t("commun.installation"),
        icon: <InstallMobileIcon />,
        to: "/installation",
      },
      {
        value: "howtoplay",
        label: t("commun.howtoplay"),
        icon: <PlayCircleIcon />,
        to: "/help",
      },
      {
        value: "report",
        label: t("commun.reportproblem"),
        icon: <ReportProblemIcon />,
        to: "/report",
      },
      {
        value: "confidentiality",
        label: t("confidentiality.title"),
        icon: <SecurityIcon />,
        to: "/confidentiality",
      },
    ],
    [t]
  );

  const menusUser: Array<Menu> = useMemo(
    () => [
      {
        value: "themes",
        label: t("commun.themes"),
        icon: <AppsIcon />,
        to: "/",
      },
      {
        value: "friends",
        label: t("commun.myfriends"),
        icon: <PeopleIcon />,
        to: "/people",
      },
      {
        value: "personalized",
        label: t("commun.personalizedprofile"),
        icon: <BrushIcon />,
        to: "/personalized",
      },
      {
        value: "statistical",
        label: t("commun.mystatistics"),
        icon: <PieChartIcon />,
        to: profile ? `/profil/${profile.id}` : "/login",
      },
      {
        value: "ranking",
        label: t("commun.ranking"),
        icon: <BarChartIcon />,
        to: "/ranking",
      },
      {
        value: "accomplishments",
        label: t("commun.myaccomplishments"),
        icon: (
          <Badge badgeContent={notificationsAccomplishment} color="error">
            <EmojiEventsIcon />
          </Badge>
        ),
        to: `/accomplishments`,
      },
      {
        value: "proposals",
        label: t("commun.myproposals"),
        icon: <EditIcon />,
        to: profile ? `/myproposals` : "/login",
      },
      {
        value: "history",
        label: t("commun.mygames"),
        icon: <HistoryIcon />,
        to: profile ? `/games` : "/login",
        state: profile ? { player: profile } : undefined,
      },
      {
        label: t("commun.compare"),
        icon: <CompareArrowsIcon />,
        value: "compare",
        to: "/compare",
        state: { profile1: profile },
      },
      {
        label: t("commun.parameters"),
        icon: <SettingsIcon />,
        value: "parameters",
        to: "/parameters",
      },
      {
        value: "faq",
        label: t("commun.faq"),
        icon: <LiveHelpIcon />,
        to: "/faq",
      },
      {
        value: "installation",
        label: t("commun.installation"),
        icon: <InstallMobileIcon />,
        to: "/installation",
      },
      {
        value: "howtoplay",
        label: t("commun.howtoplay"),
        icon: <PlayCircleIcon />,
        to: "/help",
      },
      {
        value: "report",
        label: t("commun.reportproblem"),
        icon: <ReportProblemIcon />,
        to: "/report",
      },
      {
        value: "confidentiality",
        label: t("confidentiality.title"),
        icon: <SecurityIcon />,
        to: "/confidentiality",
      },
    ],
    [profile, t, notificationsAccomplishment]
  );

  const allMenu = useMemo(
    () => (user ? menusUser : menus),
    [menus, menusUser, user]
  );

  return (
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
  );
};
