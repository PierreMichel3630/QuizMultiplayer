import { Alert, Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { HeadTitle } from "src/component/HeadTitle";
import { AccomplishmentNotificationBlock } from "src/component/notification/AccomplishmentNotificationBlock";
import { FriendNotificationBlock } from "src/component/notification/FriendNotificationBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { FRIENDSTATUS } from "src/models/Friend";

export default function NotificationPage() {
  const { t } = useTranslation();
  const { friends, getFriends, myaccomplishments } = useApp();
  const { profile } = useAuth();

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

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

  const invitationsfriends = useMemo(
    () =>
      friends.filter(
        (el) =>
          profile !== null &&
          profile.id === el.user2.id &&
          el.status === FRIENDSTATUS.PROGRESS
      ),
    [friends, profile]
  );

  const accomplishmentsNotValidate = useMemo(
    () => myaccomplishments.filter((el) => !el.validate),
    [myaccomplishments]
  );

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.notifications.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.notifications.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h2">{t("commun.friends")}</Typography>
            </Grid>
            {invitationsfriends.length > 0 ? (
              invitationsfriends.map((friend) => (
                <Grid item xs={12}>
                  <FriendNotificationBlock key={friend.id} friend={friend} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">{t("alert.nofriend")}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider sx={{ borderBottomWidth: 3 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2">
                {t("commun.accomplishments")}
              </Typography>
            </Grid>
            {accomplishmentsNotValidate.length > 0 ? (
              accomplishmentsNotValidate.map((accomplishment) => (
                <Grid item xs={12} key={accomplishment.id}>
                  <AccomplishmentNotificationBlock
                    value={accomplishment}
                    stat={stat}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">{t("alert.noaccomplishment")}</Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
