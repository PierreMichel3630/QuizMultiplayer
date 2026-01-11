import { Box, Drawer, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAppBar } from "src/context/AppBarProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Colors } from "src/style/Colors";
import { getLevel } from "src/utils/calcul";
import { drawerMinWidth, drawerWidth } from "src/utils/config";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";
import { CountryImageBlock } from "../CountryBlock";
import { MenuBlock } from "../menus/MenuBlock";
import { MoneyArrondieBlock } from "../MoneyBlock";
import { DefaultToolbar } from "../toolbar/Toolbar";
import { ButtonColor } from "../Button";
import { useTranslation } from "react-i18next";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { px } from "csx";

export const DrawerMenus = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useUser();
  const { logout, profile } = useAuth();
  const { openDrawer } = useAppBar();

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [profile]);

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

  const drawerSize = useMemo(
    () => (openDrawer ? drawerWidth : drawerMinWidth),
    [openDrawer]
  );

  const disconnect = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerSize,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerSize, boxSizing: "border-box" },
      }}
    >
      <DefaultToolbar />
      <Box sx={{ overflow: "auto" }}>
        {profile && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box sx={{ p: 1, display: "flex", gap: 1, alignItems: "center" }}>
              <Link to={`/personalized`} style={{ textDecoration: "none" }}>
                <AvatarAccountBadge
                  avatar={profile.avatar.icon}
                  size={50}
                  level={level}
                  profile={profile}
                  color={Colors.blue4}
                />
              </Link>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {profile.country && (
                    <Link
                      to={`/personalized`}
                      style={{ textDecoration: "none" }}
                    >
                      <CountryImageBlock country={profile.country} size={25} />
                    </Link>
                  )}
                  <Link
                    to={profile ? `/profil/${profile.id}` : "/login"}
                    style={{
                      textDecoration: "none",
                      maxWidth: "calc(100% -30px)",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        overflow: "hidden",
                        display: "block",
                        lineClamp: 1,
                        boxOrient: "vertical",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {profile.username}
                    </Typography>
                  </Link>
                </Box>
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Link to={`/shop`} style={{ textDecoration: "none" }}>
                      <MoneyArrondieBlock
                        money={profile.money}
                        language={language}
                        variant="h4"
                        width={22}
                        color="text.primary"
                      />
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ButtonColor
                fullWidth
                value={Colors.red}
                label={t("commun.logout")}
                icon={PowerSettingsNewIcon}
                variant="contained"
                onClick={disconnect}
                sx={{
                  width: "fit-content",
                  borderRadius: px(50),
                }}
                typography="h6"
              />
            </Box>
          </Box>
        )}

        <MenuBlock open={openDrawer} />
      </Box>
    </Drawer>
  );
};
