import {
  Alert,
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { insertFriend, selectFriend } from "src/api/friend";
import { searchProfile } from "src/api/profile";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { FRIENDSTATUS, Friend, FriendInsert } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { BasicSearchInput } from "../Input";
import { Loading } from "../Loading";
import { CardProfile } from "../card/CardProfile";

interface Props {
  open: boolean;
  close: () => void;
  onValid: () => void;
}

export const AddFriendModal = ({ open, close, onValid }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { setMessage, setSeverity } = useMessage();

  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState<Array<Profile>>([]);

  const [uuidfriends, setUuidFriends] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async () => {
    const { data } = await searchProfile(search, uuidfriends);
    setProfiles(data ? (data as Array<Profile>) : []);
  };

  useEffect(() => {
    if (search !== "") {
      getUsers();
    } else {
      setProfiles([]);
    }
  }, [search, user, uuidfriends]);

  const getFriends = async () => {
    const { data } = await selectFriend();
    const friends = data as Array<Friend>;
    const uuids: Array<string> = user ? [user.id] : [];
    friends
      .filter((el) => el.status !== FRIENDSTATUS.REFUSE)
      .forEach((el) => {
        uuids.push(el.user1.id);
        uuids.push(el.user2.id);
      });
    setUuidFriends([...new Set(uuids)]);
    setIsLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);

  const addToFriend = async (profile: Profile) => {
    if (user !== null) {
      const invitation: FriendInsert = {
        user1: user.id,
        user2: profile.id,
      };
      const { error } = await insertFriend(invitation);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setUuidFriends((prev) => [...prev, profile.id]);
        setSeverity("success");
        setMessage(t("alert.sendfriendrequest"));
        onValid();
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Dialog onClose={close} open={open} fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.addfriend")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          {isLoading ? (
            <Grid item xs={12}>
              <Loading />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <BasicSearchInput
                  label={t("commun.searchfriend")}
                  onChange={(value) => setSearch(value)}
                  value={search}
                  clear={() => setSearch("")}
                />
              </Grid>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    key={profile.id}
                  >
                    <CardProfile
                      profile={profile}
                      addToFriend={() => addToFriend(profile)}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="warning">{t("commun.noresult")}</Alert>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
