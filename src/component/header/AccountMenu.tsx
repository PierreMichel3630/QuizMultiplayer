import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { style } from "typestyle";
import { AccountBadge } from "../AccountBadge";

import LogoutIcon from "@mui/icons-material/Logout";
import { User } from "@supabase/supabase-js";
import { important, px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { AvatarAccount } from "../avatar/AvatarAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useApp } from "src/context/AppProvider";
import BrushIcon from "@mui/icons-material/Brush";
import NotificationsIcon from "@mui/icons-material/Notifications";

const divCss = style({
  display: "flex",
  alignItems: "center",
  gap: px(5),
});

interface Setting {
  name: string;
  url: string;
  icon: JSX.Element;
}

interface Props {
  user: User;
}

export const AccountMenu = ({ user }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, logout } = useAuth();
  const { refreshFriends } = useApp();
  const { setUuid } = useUser();

  const settings: Array<Setting> =
    profile && profile.isadmin
      ? [
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
          {
            name: t("commun.administration"),
            icon: <AdminPanelSettingsIcon />,
            url: "/administration/question",
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
    refreshFriends();
  };

  const goTo = (url: string) => {
    handleCloseUserMenu();
    navigate(url);
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
                  {profile && (
                    <Typography variant="h6">{profile.username}</Typography>
                  )}
                  <Typography variant="caption">{user.email}</Typography>
                </div>
              </div>
            </MenuItem>
            <Divider sx={{ m: important(0) }} />
          </div>
        )}
        {settings.map((setting, index) => (
          <MenuItem
            key={index}
            onClick={() => goTo(setting.url)}
            sx={{ minHeight: "auto" }}
          >
            <ListItemIcon>{setting.icon}</ListItemIcon>
            <ListItemText primary={setting.name} />
          </MenuItem>
        ))}
        <Divider sx={{ m: important(0) }} />
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
