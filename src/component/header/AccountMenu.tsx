import {
  Box,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { style } from "typestyle";
import { AccountBadge } from "../AccountBadge";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BrushIcon from "@mui/icons-material/Brush";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ImageIcon from "@mui/icons-material/Image";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ReportIcon from "@mui/icons-material/Report";
import SettingsIcon from "@mui/icons-material/Settings";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { User } from "@supabase/supabase-js";
import { important, px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { AvatarAccount } from "../avatar/AvatarAccount";

const divCss = style({
  display: "flex",
  alignItems: "center",
  gap: px(5),
});

interface Setting {
  name: string;
  url: string;
  icon: JSX.Element;
  state?: unknown;
}

interface Props {
  user: User;
}

export const AccountMenu = ({ user }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, logout } = useAuth();
  const { getFriends } = useApp();
  const { setUuid } = useUser();

  const settings: Array<Setting> = profile
    ? [
        {
          name: t("commun.personalizedprofile"),
          icon: <BrushIcon />,
          url: "/personalized",
        },
        {
          name: t("commun.myaccomplishments"),
          icon: <EmojiEventsIcon />,
          url: `/accomplishments`,
        },
        {
          name: t("commun.compare"),
          icon: <CompareArrowsIcon />,
          url: "/compare",
          state: { profile1: profile },
        },
        {
          name: t("commun.notifications"),
          icon: <NotificationsIcon />,
          url: "/notifications",
        },
        {
          name: t("commun.myparameter"),
          icon: <SettingsIcon />,
          url: "/parameter",
        },
      ]
    : [
        {
          name: t("commun.personalizedprofile"),
          icon: <BrushIcon />,
          url: "/personalized",
        },
        {
          name: t("commun.myaccomplishments"),
          icon: <EmojiEventsIcon />,
          url: "/accomplishments",
        },
        {
          name: t("commun.notifications"),
          icon: <NotificationsIcon />,
          url: "/notifications",
        },
        {
          name: t("commun.myparameter"),
          icon: <SettingsIcon />,
          url: "/parameter",
        },
      ];
  const settingsAdmin: Array<Setting> =
    profile && profile.isadmin
      ? [
          {
            name: t("commun.report"),
            icon: <ReportIcon />,
            url: "/administration/report",
          },
          {
            name: t("commun.adminquestions"),
            icon: <QuestionMarkIcon />,
            url: "/administration/question",
          },
          {
            name: t("commun.themes"),
            icon: <AdminPanelSettingsIcon />,
            url: "/administration/themes",
          },
          {
            name: t("commun.games"),
            icon: <SportsEsportsIcon />,
            url: "/administration/games",
          },
          {
            name: t("commun.images"),
            icon: <ImageIcon />,
            url: "/administration/images",
          },
        ]
      : [];

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const disconnect = async () => {
    handleCloseUserMenu();
    await logout();
    setUuid(crypto.randomUUID());
    getFriends();
  };

  const goTo = (url: string, state: unknown) => {
    handleCloseUserMenu();
    navigate(url, {
      state: state,
    });
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AccountBadge onClick={handleOpenUserMenu} />
      <Menu
        sx={{ mt: "45px", pt: 0, pb: 0 }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {profile && (
          <div>
            <MenuItem
              sx={{
                cursor: "default",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <div className={divCss}>
                <AvatarAccount avatar={profile.avatar.icon} size={50} />
                <div>
                  <Grid container sx={{ gap: px(2) }}>
                    {profile && (
                      <Grid item xs={12}>
                        <Typography variant="h6">{profile.username}</Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="caption">{user.email}</Typography>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </MenuItem>
            <Divider sx={{ m: important(0) }} />
          </div>
        )}
        {settings.map((setting, index) => (
          <MenuItem
            key={index}
            onClick={() => goTo(setting.url, setting.state)}
            sx={{ minHeight: "auto" }}
          >
            <ListItemIcon>{setting.icon}</ListItemIcon>
            <ListItemText primary={setting.name} />
          </MenuItem>
        ))}
        <Divider sx={{ m: important(0) }} />

        {settingsAdmin.length > 0 && (
          <div>
            <Box sx={{ p: px(5), textAlign: "center" }}>
              <Typography variant="h6">{t("commun.administration")}</Typography>
            </Box>
            {settingsAdmin.map((setting, index) => (
              <MenuItem
                key={index}
                onClick={() => goTo(setting.url, setting.state)}
                sx={{ minHeight: "auto" }}
              >
                <ListItemIcon>{setting.icon}</ListItemIcon>
                <ListItemText primary={setting.name} />
              </MenuItem>
            ))}
            <Divider sx={{ m: important(0) }} />
          </div>
        )}
        <MenuItem onClick={disconnect} sx={{ minHeight: "auto" }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("commun.logout")} />
        </MenuItem>
      </Menu>
    </Box>
  );
};
