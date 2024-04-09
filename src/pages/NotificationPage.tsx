import { Alert, Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectInvitationDuelByUser } from "src/api/game";
import { DuelNotificationBlock } from "src/component/notification/DuelNotificationBlock";
import { FriendNotificationBlock } from "src/component/notification/FriendNotificationBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { FRIENDSTATUS } from "src/models/Friend";

export const NotificationPage = () => {
  const { t } = useTranslation();
  const { friends, refreshFriends } = useApp();
  const { user } = useAuth();
  const { uuid } = useUser();
  const [games, setGames] = useState<Array<DuelGame>>([]);

  useEffect(() => {
    refreshFriends();
  }, []);

  const invitationsfriends = friends.filter(
    (el) =>
      user !== null &&
      user.id === el.user2.id &&
      el.status === FRIENDSTATUS.PROGRESS
  );

  const getGames = () => {
    selectInvitationDuelByUser(uuid).then(({ data }) => {
      setGames(data as Array<DuelGame>);
    });
  };

  useEffect(() => {
    getGames();
  }, [uuid]);

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.notifications.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h2">{t("commun.friends")}</Typography>
        </Grid>
        <Grid item xs={12}>
          {invitationsfriends.length > 0 ? (
            invitationsfriends.map((friend) => (
              <FriendNotificationBlock friend={friend} />
            ))
          ) : (
            <Alert severity="info">{t("alert.nofriend")}</Alert>
          )}
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 3 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">{t("commun.games")}</Typography>
        </Grid>
        <Grid item xs={12}>
          {games.length > 0 ? (
            games.map((game) => (
              <DuelNotificationBlock
                key={game.id}
                game={game}
                refuse={() => getGames()}
              />
            ))
          ) : (
            <Alert severity="info">{t("alert.nogame")}</Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
