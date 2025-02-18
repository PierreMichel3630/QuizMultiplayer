import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import { Helmet } from "react-helmet-async";
import { updateSelectProfil } from "src/api/profile";
import { BadgeSelector } from "src/component/BadgeSelector";
import { BannerSelector } from "src/component/BannerSelector";
import { ButtonColor } from "src/component/Button";
import { MyCountryBlock } from "src/component/MyCountryBlock";
import { ProfilHeader } from "src/component/ProfileHeader";
import { TitleSelector } from "src/component/TitleSelector";
import { AvatarSelector } from "src/component/avatar/AvatarSelector";
import { SkeletonRectangular } from "src/component/skeleton/SkeletonRectangular";
import { useApp } from "src/context/AppProvider";
import { useMessage } from "src/context/MessageProvider";
import { Avatar } from "src/models/Avatar";
import { Badge } from "src/models/Badge";
import { Banner } from "src/models/Banner";
import { Profile } from "src/models/Profile";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import { UsernameInput } from "src/component/input/UsernameInput";
import { Country } from "src/models/Country";
import { EmailInput } from "src/component/input/EmailInput";
import { DeleteAccountButton } from "src/component/button/DeleteAcccountButton";

export default function PersonalizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { setMessage, setSeverity } = useMessage();
  const { user, profile, setProfile } = useAuth();
  const { getMyTitles, getMyBadges, headerSize } = useApp();

  useEffect(() => {
    getMyTitles();
    getMyBadges();
  }, [getMyBadges, getMyTitles]);

  const changeTitle = async (value: Title) => {
    if (user) {
      const newProfil = { id: user.id, title: value.id };
      const { data, error } = await updateSelectProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatetitlesuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const changeBadge = async (value: Badge) => {
    if (user) {
      const newProfil = {
        id: user.id,
        badge: value.id,
      };
      const { data, error } = await updateSelectProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatebadgesuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const changeBanner = async (value: Banner | null) => {
    if (user) {
      const newProfil = {
        id: user.id,
        banner: value !== null ? value.id : null,
      };
      const { data, error } = await updateSelectProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatebanneruccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const changeAvatar = async (value: Avatar) => {
    if (user) {
      const newProfil = { id: user.id, avatar: value.id };
      const { data, error } = await updateSelectProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateavatarsuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const changeCountry = async (country: Country | null) => {
    if (user) {
      const newProfil = {
        id: user.id,
        country: country !== null ? country.id : null,
      };
      const { data, error } = await updateSelectProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateorigincountrysuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.perzonalised.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: headerSize,
          zIndex: 100,
          pb: 1,
        }}
      >
        <Container maxWidth="md">
          {profile && <ProfilHeader profile={profile} />}
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12}>
              <UsernameInput />
            </Grid>
            <Grid item xs={12}>
              <EmailInput />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4">
                {t("commun.myorigincountry")}
              </Typography>
            </Grid>
            {profile ? (
              <Grid item xs={12} md={8}>
                <MyCountryBlock
                  country={profile.country}
                  onChange={(value) => changeCountry(value)}
                  onDelete={() => changeCountry(null)}
                />
              </Grid>
            ) : (
              <Grid item xs={12} md={8}>
                <SkeletonRectangular height={40} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{t("commun.avatars")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <AvatarSelector onSelect={changeAvatar} />
            </Grid>
            <Grid item xs={12}>
              <ButtonColor
                fullWidth
                value={Colors.green}
                label={t("commun.unlocknewavatars")}
                icon={LockOpenIcon}
                variant="contained"
                onClick={() => navigate("/shop")}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{t("commun.badges")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <BadgeSelector onSelect={changeBadge} />
            </Grid>
            <Grid item xs={12}>
              <ButtonColor
                fullWidth
                value={Colors.green}
                label={t("commun.unlocknewbadges")}
                icon={LockOpenIcon}
                variant="contained"
                onClick={() => navigate("/shop")}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{t("commun.banners")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <BannerSelector onSelect={changeBanner} />
            </Grid>
            <Grid item xs={12}>
              <ButtonColor
                fullWidth
                value={Colors.green}
                label={t("commun.unlocknewbanners")}
                icon={LockOpenIcon}
                variant="contained"
                onClick={() => navigate("/shop")}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{t("commun.titles")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TitleSelector onSelect={changeTitle} />
            </Grid>
            <Grid item xs={12}>
              <ButtonColor
                fullWidth
                value={Colors.green}
                label={t("commun.unlocknewtitles")}
                icon={LockOpenIcon}
                variant="contained"
                onClick={() => navigate("/shop")}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <DeleteAccountButton />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
