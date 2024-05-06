import {
  Alert,
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import { selectFriend } from "src/api/friend";
import { useUser } from "src/context/UserProvider";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { BasicSearchInput } from "../Input";
import { Loading } from "../Loading";
import { CardProfile } from "../card/CardProfile";
import { Profile } from "src/models/Profile";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  withMe?: boolean;
  open: boolean;
  close: () => void;
  onValid: (uuid: Profile) => void;
}

export const SelectFriendModal = ({
  open,
  close,
  onValid,
  withMe = false,
}: Props) => {
  const { t } = useTranslation();
  const { uuid } = useUser();
  const { profile } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = useState("");

  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getFriends = async () => {
    const { data } = await selectFriend();
    const friends = data as Array<Friend>;
    setFriends(friends);
    setIsLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);

  const profiles = useMemo(() => {
    const profileFriend = friends
      .filter((el) => el.status === FRIENDSTATUS.VALID)
      .map((el) => (el.user1.id === uuid ? el.user2 : el.user1))
      .filter((el) =>
        search !== ""
          ? el.username.toLowerCase().includes(search.toLowerCase())
          : true
      );
    return withMe && profile !== null
      ? [profile, ...profileFriend]
      : profileFriend;
  }, [friends, search, uuid, withMe, profile]);

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      sx={{ backgroundColor: "inherit" }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.myfriends")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 1 }}>
        <Grid container spacing={1}>
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
                      onSelect={() => onValid(profile)}
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
