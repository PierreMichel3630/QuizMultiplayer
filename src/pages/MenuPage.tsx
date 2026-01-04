import { Box, Button, Grid, Typography } from "@mui/material";
import { important, percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CountryBlock } from "src/component/CountryBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

import LogoutIcon from "@mui/icons-material/Logout";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { HeadTitle } from "src/component/HeadTitle";
import { ShareApplicationBlock } from "src/component/ShareApplicationBlock";
import { MenuBlock } from "src/component/menus/MenuBlock";
import { ProfileTitleBlock } from "src/component/title/ProfileTitle";
import { StatAccomplishment } from "src/models/Accomplishment";
import { getLevel } from "src/utils/calcul";

export default function MenuPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
                : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.colorApp} 46%, ${Colors.blue} 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              width: percent(100),
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              <Grid sx={{ mb: 1 }}>
                <AvatarAccountBadge
                  profile={profile}
                  size={120}
                  color={Colors.white}
                  backgroundColor={Colors.grey2}
                  level={level}
                />
              </Grid>
              <Grid
                sx={{
                  textAlign: "center",
                }}
                size={12}>
                <Typography variant="h2" color="text.secondary">
                  {profile.username}
                </Typography>
                <ProfileTitleBlock titleprofile={profile.titleprofile} />
              </Grid>
              {profile.country && (
                <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
                  <CountryBlock
                    country={profile.country}
                    color="text.secondary"
                  />
                </Grid>
              )}
              <Grid size={12}>
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
        <Grid sx={{ p: 1 }} size={12}>
          <ShareApplicationBlock title={t("commun.shareapplication")} />
        </Grid>
        <Grid size={12}>
          <MenuBlock />
        </Grid>
      </Grid>
    </Box>
  );
}
