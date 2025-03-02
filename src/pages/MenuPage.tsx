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
import { important, percent, px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CountryBlock } from "src/component/CountryBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

import BarChartIcon from "@mui/icons-material/BarChart";
import BrushIcon from "@mui/icons-material/Brush";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SecurityIcon from "@mui/icons-material/Security";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { HeadTitle } from "src/component/HeadTitle";
import { MoneyBlock } from "src/component/MoneyBlock";
import { ShareApplicationBlock } from "src/component/ShareApplicationBlock";
import { useApp } from "src/context/AppProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { getLevel } from "src/utils/calcul";

interface Menu {
  value: string;
  label: string;
  icon: JSX.Element;
  to: string;
  state?: unknown;
}

export default function MenuPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { myaccomplishments } = useApp();
  const { user, profile, logout } = useAuth();

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (user) {
        selectStatAccomplishmentByProfile(user.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [user]);

  const notificationsAccomplishment = useMemo(
    () => myaccomplishments.filter((el) => !el.validate).length,
    [myaccomplishments]
  );

  const menus: Array<Menu> = useMemo(
    () => [
      {
        value: "ranking",
        label: t("commun.ranking"),
        icon: <BarChartIcon />,
        to: "/ranking",
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
        value: "personalized",
        label: t("commun.personalizedprofile"),
        icon: <BrushIcon />,
        to: "/personalized",
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
        to: profile ? `/accomplishments` : `/login`,
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

  const disconnect = async () => {
    await logout();
    navigate("/");
  };

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

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
              backgroundImage: profile?.banner
                ? `url("${profile.banner.src}")`
                : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.blue3} 46%, ${Colors.blue} 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              width: percent(100),
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              <Grid item sx={{ mb: 1 }}>
                <AvatarAccountBadge
                  profile={profile}
                  size={120}
                  color={Colors.white}
                  backgroundColor={Colors.grey2}
                  level={level}
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
              {profile && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <MoneyBlock money={profile.money} />
                </Grid>
              )}
              {profile.country && (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <CountryBlock
                    country={profile.country}
                    color="text.secondary"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderRadius: px(50),
                    backgroundColor: important(Colors.white),
                    borderWidth: important(px(2)),
                    color: important(Colors.black),
                  }}
                  onClick={disconnect}
                >
                  {t("commun.logout")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <HeadTitle title={t("commun.menus")} />
        )}
        <Grid item xs={12} sx={{ p: 1 }}>
          <ShareApplicationBlock title={t("commun.shareapplication")} />
        </Grid>
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
}
