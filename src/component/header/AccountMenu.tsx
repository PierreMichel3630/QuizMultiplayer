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
import { useTranslation } from "react-i18next";
import { User } from "@supabase/supabase-js";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Link, useNavigate } from "react-router-dom";
import { important, px } from "csx";
import { AvatarAccount } from "../avatar/AvatarAccount";

import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { useUser } from "src/context/UserProvider";

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
  const { setUuid } = useUser();

  const settings: Array<Setting> = [
    {
      name: t("commun.myfriends"),
      icon: <PeopleIcon fontSize="small" color="primary" />,
      url: "/friends",
    },
    {
      name: t("commun.myparameter"),
      icon: <SettingsIcon fontSize="small" color="primary" />,
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
    navigate(0);
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
            <MenuItem>
              <Link to={`/user/${profile.id}`}>
                <div className={divCss}>
                  <AvatarAccount avatar={profile.avatar} size={50} />
                  <div>
                    {profile && (
                      <Typography variant="h6">{profile.username}</Typography>
                    )}
                    <Typography variant="caption">{user.email}</Typography>
                  </div>
                </div>
              </Link>
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
            <LogoutIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary={t("commun.logout")} />
        </MenuItem>
      </Menu>
    </Box>
  );
};
