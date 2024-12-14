import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ImageIcon from "@mui/icons-material/Image";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ReportIcon from "@mui/icons-material/Report";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { padding, px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

interface Setting {
  name: string;
  url: string;
  icon: JSX.Element;
  state?: unknown;
}

export const AdminButton = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
          sx={{
            p: padding(1, 5),
            border: "2px solid",
            borderColor: Colors.white,
            borderRadius: px(5),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleOpenUserMenu}
        >
          <AdminPanelSettingsIcon
            sx={{ color: Colors.white, fontSize: px(25) }}
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
