import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";

import EditIcon from "@mui/icons-material/Edit";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportIcon from "@mui/icons-material/Report";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { padding, px } from "csx";
import { Colors } from "src/style/Colors";
import { useIsMobileOrTablet } from "src/hook/useSize";

interface Setting {
  name: string;
  url: string;
  icon: JSX.Element;
  state?: unknown;
}

export const AdminButton = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const isMobileOrTablet = useIsMobileOrTablet();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const settingsAdmin: Array<Setting> = useMemo(
    () =>
      profile?.isadmin
        ? [
            {
              name: t("commun.propose"),
              icon: <EmojiObjectsIcon />,
              url: "/administration/propose",
            },
            {
              name: t("commun.report"),
              icon: <ReportIcon />,
              url: "/administration/report",
            },
            {
              name: t("commun.challenge"),
              icon: <EmojiEventsIcon />,
              url: "/administration/challenge",
            },
            {
              name: t("commun.shop"),
              icon: <ShoppingCartIcon />,
              url: "/administration/shop",
            },
            {
              name: t("commun.administration"),
              icon: <EditIcon />,
              url: "/administration/edit/categories",
            },
            {
              name: t("commun.games"),
              icon: <SportsEsportsIcon />,
              url: "/administration/games",
            },
            {
              name: t("commun.notifications"),
              icon: <NotificationsIcon />,
              url: "/administration/notifications",
            },
          ]
        : [],
    [profile, t]
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const goTo = (url: string, state: unknown) => {
    handleCloseUserMenu();
    navigate(url, {
      state: state,
    });
  };

  return (
    profile &&
    profile.isadmin && (
      <>
        <Box
          onClick={handleOpenUserMenu}
          sx={
            isMobileOrTablet
              ? {
                  p: padding(2, 8),
                  border: "2px solid",
                  borderColor: Colors.white,
                  borderRadius: px(5),
                  display: "flex",
                }
              : {}
          }
        >
          <AdminPanelSettingsIcon
            fontSize={isMobileOrTablet ? "medium" : "large"}
          />
        </Box>
        <Menu
          sx={{ mt: "35px", pt: 0, pb: 0 }}
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
          {settingsAdmin.length > 0 && (
            <div>
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
            </div>
          )}
        </Menu>
      </>
    )
  );
};
