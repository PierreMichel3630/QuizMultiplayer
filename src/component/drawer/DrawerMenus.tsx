import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { Box, Drawer, Grid, SwipeableDrawer, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAppBar } from "src/context/AppBarProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { StatAccomplishment } from "src/models/Accomplishment";
import { DrawerSize } from "src/models/enum/DrawerSize";
import { Colors } from "src/style/Colors";
import { getLevel } from "src/utils/calcul";
import { drawerMinWidth, drawerWidth } from "src/utils/config";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";
import { ButtonColor } from "../Button";
import { CountryImageBlock } from "../CountryBlock";
import { HeaderLogo } from "../header/HeaderLogo";
import { MenuBlock } from "../menus/MenuBlock";
import { MoneyArrondieBlock } from "../MoneyBlock";
import { DefaultToolbar } from "../toolbar/Toolbar";

export const DrawerMenus = () => {
  const { openDrawer, sizeDrawer, toogleOpenDrawer } = useAppBar();

  const isMobileOrTablet = useIsMobileOrTablet();

  const drawerSize = useMemo(
    () => (sizeDrawer === DrawerSize.MEDIUM ? drawerWidth : drawerMinWidth),
    [sizeDrawer],
  );

  return isMobileOrTablet ? (
    <SwipeableDrawer
      anchor="left"
      open={openDrawer}
      onClose={toogleOpenDrawer}
      onOpen={toogleOpenDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <DrawerContent size={DrawerSize.MEDIUM} onRedirect={toogleOpenDrawer} />
    </SwipeableDrawer>
  ) : (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerSize,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerSize, boxSizing: "border-box" },
      }}
    >
      <DrawerContent size={sizeDrawer} />
    </Drawer>
  );
};

interface PropsDrawerContent {
  size: DrawerSize;
  onRedirect?: () => void;
}
const DrawerContent = ({
  size = DrawerSize.MEDIUM,
  onRedirect,
}: PropsDrawerContent) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useUser();
  const { logout, profile } = useAuth();
  const isMobileOrTablet = useIsMobileOrTablet();

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

  const isMediumSize = useMemo(() => size === DrawerSize.MEDIUM, [size]);

  const disconnect = async () => {
    await logout();
    navigate("/");
    if (onRedirect) {
      onRedirect();
    }
  };

  return (
    <>
      {!isMobileOrTablet && <DefaultToolbar />}
      <Box sx={{ overflowY: "auto", overflowX: "hidden" }}>
        <Grid container spacing={1}>
          {isMobileOrTablet && (
            <Grid size={12} sx={{ p: 1 }}>
              <HeaderLogo />
            </Grid>
          )}
          {profile && isMediumSize && (
            <Grid size={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{ p: 1, display: "flex", gap: 1, alignItems: "center" }}
                >
                  <Link
                    to={`/personalized`}
                    style={{ textDecoration: "none" }}
                    onClick={onRedirect}
                  >
                    <AvatarAccountBadge
                      avatar={profile.avatar.icon}
                      size={50}
                      level={level}
                      profile={profile}
                      color={Colors.blue4}
                    />
                  </Link>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      {profile.country && (
                        <Link
                          to={`/personalized`}
                          style={{ textDecoration: "none" }}
                          onClick={onRedirect}
                        >
                          <CountryImageBlock
                            country={profile.country}
                            size={25}
                          />
                        </Link>
                      )}
                      <Link
                        to={profile ? `/profil/${profile.id}` : "/login"}
                        style={{
                          textDecoration: "none",
                          maxWidth: "calc(100% -30px)",
                        }}
                        onClick={onRedirect}
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
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Link
                          to={`/shop`}
                          style={{ textDecoration: "none" }}
                          onClick={onRedirect}
                        >
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
            </Grid>
          )}
          <Grid size={12}>
            <MenuBlock sizeDrawer={size} onRedirect={onRedirect} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
