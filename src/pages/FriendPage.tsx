import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { deleteFriendById, updateFriend } from "src/api/friend";
import {
  CardInvitationFriend,
  CardRequestFriend,
} from "src/component/card/CardFriend";
import { CardProfile } from "src/component/card/CardProfile";
import { AddFriendModal } from "src/component/modal/AddFriendModal";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS, Friend, FriendUpdate } from "src/models/Friend";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import moment from "moment";
import { updateProfil } from "src/api/profile";
import { useApp } from "src/context/AppProvider";
import { useMessage } from "src/context/MessageProvider";
import { Profile, ProfileUpdate } from "src/models/Profile";
import { GoHomeButton } from "src/component/navigation/GoBackButton";

export const FriendPage = () => {
  const { t } = useTranslation();
  const { profile, setProfile } = useAuth();
  const { friends, refreshFriends } = useApp();
  const { setMessage, setSeverity } = useMessage();
  const [openAddFriend, setOpenAddFriend] = useState(false);

  useEffect(() => {
    refreshFriends();
  }, []);

  const confirmFriend = async (friend: Friend, status: FRIENDSTATUS) => {
    const value: FriendUpdate = {
      id: friend.id,
      status: status,
    };
    const { error } = await updateFriend(value);
    if (error) {
      setSeverity("error");
      setMessage(t("commun.error"));
    } else {
      setSeverity("success");
      setMessage(
        status === FRIENDSTATUS.VALID
          ? t("alert.validatefriendrequest")
          : t("alert.refusefriendrequest")
      );
      refreshFriends();
    }
  };

  const deleteFriend = (profile: Profile) => {
    const friend = friends.find(
      (el) =>
        el.status === FRIENDSTATUS.VALID &&
        (el.user1.id === profile.id || el.user2.id === profile.id)
    );
    if (friend) {
      deleteFriendById(friend.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setSeverity("success");
          setMessage(t("alert.deletefriend"));
          refreshFriends();
        }
      });
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const invitations = friends.filter(
    (el) =>
      profile !== null &&
      profile.id === el.user2.id &&
      el.status === FRIENDSTATUS.PROGRESS
  );

  const requests = friends.filter(
    (el) =>
      profile !== null &&
      profile.id === el.user1.id &&
      el.status === FRIENDSTATUS.PROGRESS
  );

  const profiles = friends
    .filter((el) => el.status === FRIENDSTATUS.VALID)
    .map((el) => (profile && el.user1.id === profile.id ? el.user2 : el.user1));

  useEffect(() => {
    const refreshSeen = async () => {
      if (profile !== null) {
        const newProfil: ProfileUpdate = {
          id: profile.id,
          last_seen_friend: moment().toDate(),
        };
        const { data } = await updateProfil(newProfil);
        if (data) setProfile(data as Profile);
      }
    };
    refreshSeen();
  }, []);

  return (
    <Box>
      <GoHomeButton />
      <Paper sx={{ p: 2 }}>
        <Helmet>
          <title>{`${t("pages.friend.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h1" sx={{ fontSize: 30 }}>
              {t("pages.friend.title")}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 3,
            }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              fullWidth
              onClick={() => setOpenAddFriend(true)}
            >
              {t("commun.addfriend")}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider>
              <Chip label={t("commun.myinvitation")} size="small" />
            </Divider>
          </Grid>
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <Grid item xs={12} key={invitation.id}>
                <CardInvitationFriend
                  friend={invitation}
                  validate={() => confirmFriend(invitation, FRIENDSTATUS.VALID)}
                  refuse={() => confirmFriend(invitation, FRIENDSTATUS.REFUSE)}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="warning">{t("commun.noresultinvitation")}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider>
              <Chip label={t("commun.myrequests")} size="small" />
            </Divider>
          </Grid>
          {requests.length > 0 ? (
            requests.map((invitation) => (
              <Grid item xs={12} key={invitation.id}>
                <CardRequestFriend friend={invitation} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="warning">{t("commun.noresultrequest")}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider>
              <Chip label={t("commun.myfriends")} size="small" />
            </Divider>
          </Grid>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <Grid item xs={12} sm={6} md={4} key={profile.id}>
                <CardProfile
                  profile={profile}
                  deleteToFriend={() => deleteFriend(profile)}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="warning">{t("commun.noresultfriends")}</Alert>
            </Grid>
          )}
        </Grid>
        <AddFriendModal
          open={openAddFriend}
          close={() => setOpenAddFriend(false)}
          onValid={() => {
            setOpenAddFriend(false);
            refreshFriends();
          }}
        />
      </Paper>
    </Box>
  );
};
