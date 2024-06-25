import { Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { updateProfil } from "src/api/profile";
import { BadgeSelector } from "src/component/BadgeSelector";
import { HeadTitle } from "src/component/HeadTitle";
import { MyCountryBlock } from "src/component/MyCountryBlock";
import { SelectTitle } from "src/component/Select";
import { AvatarSelector } from "src/component/avatar/AvatarSelector";
import { SelectCountryModal } from "src/component/modal/SelectCountryModal";
import { useApp } from "src/context/AppProvider";
import { useMessage } from "src/context/MessageProvider";
import { Avatar } from "src/models/Avatar";
import { Badge } from "src/models/Badge";
import { Profile } from "src/models/Profile";

export const PersonalizedPage = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const { user, profile, setProfile } = useAuth();
  const { getMyTitles, getMyBadges } = useApp();

  const [openCountry, setOpenCountry] = useState(false);

  const { hash } = useLocation();
  const refBadge = useRef(null);
  const refTitle = useRef(null);

  useEffect(() => {
    if (hash === "#badges") {
      executeScroll(refBadge);
    } else if (hash === "#titles") {
      executeScroll(refTitle);
    }
  }, [hash]);

  const executeScroll = (ref: any) => {
    const top = ref.current.offsetTop;
    window.scrollTo({
      top: top - 70,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    getMyTitles();
    getMyBadges();
  }, []);

  const changeTitle = async (value: number) => {
    if (user) {
      const newProfil = { id: user.id, title: value };
      const { data, error } = await updateProfil(newProfil);
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
      const newProfil = { id: user.id, badge: value.id };
      const { data, error } = await updateProfil(newProfil);
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

  const changeAvatar = async (value: Avatar) => {
    if (user) {
      const newProfil = { id: user.id, avatar: value.id };
      const { data, error } = await updateProfil(newProfil);
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

  const changeCountry = async (id: number | null) => {
    if (user) {
      const newProfil = { id: user.id, country: id };
      const { data, error } = await updateProfil(newProfil);
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
    setOpenCountry(false);
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.perzonalised.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("commun.personalizedprofile")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.avatars")}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <AvatarSelector onSelect={changeAvatar} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" ref={refBadge}>
                    {t("commun.badges")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <BadgeSelector onSelect={changeBadge} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4">
                    {t("commun.myorigincountry")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <MyCountryBlock
                    profile={profile}
                    onChange={() => setOpenCountry(true)}
                    onDelete={() => changeCountry(null)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} ref={refTitle}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4">{t("commun.titles")}</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <SelectTitle onChange={changeTitle} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {openCountry && (
        <SelectCountryModal
          open={openCountry}
          close={() => setOpenCountry(false)}
          onValid={changeCountry}
        />
      )}
    </Grid>
  );
};
