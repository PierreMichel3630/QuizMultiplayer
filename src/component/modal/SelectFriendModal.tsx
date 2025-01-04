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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { uniqBy } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { FRIENDSTATUS } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { BasicSearchInput } from "../Input";
import { CardProfile } from "../card/CardProfile";
import { sortByUsername } from "src/utils/sort";
interface Props {
  title?: string;
  withMe?: boolean;
  open: boolean;
  close: () => void;
  onValid: (uuid: Profile) => void;
}

export const SelectFriendModal = ({
  open,
  close,
  onValid,
  title,
  withMe = false,
}: Props) => {
  const { t } = useTranslation();
  const { uuid } = useUser();
  const { profile } = useAuth();
  const { friends } = useApp();
  const theme = useTheme();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = useState("");

  const profiles = useMemo(() => {
    const profileFriend = friends
      .filter((el) => el.status === FRIENDSTATUS.VALID)
      .map((el) => (el.user1.id === uuid ? el.user2 : el.user1))
      .filter((el) =>
        search !== ""
          ? el.username.toLowerCase().includes(search.toLowerCase())
          : true
      );
    const res =
      withMe && profile !== null ? [profile, ...profileFriend] : profileFriend;
    return uniqBy(res, (el) => el.id).sort(sortByUsername);
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
            {title ? title : t("commun.myfriends")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 1 }}>
        <Grid container spacing={1}>
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
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={profile.id}>
                <CardProfile
                  profile={profile}
                  onSelect={() => onValid(profile)}
                />
              </Grid>
            ))
          ) : (
            <>
              {search !== "" ? (
                <Grid item xs={12}>
                  <Alert severity="warning">{t("commun.noresult")}</Alert>
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Alert severity="info">{t("commun.noresultfriends")}</Alert>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ButtonColor
                      value={Colors.blue}
                      label={t("commun.addfriend")}
                      variant="contained"
                      onClick={() => {
                        close();
                        navigate("/people");
                      }}
                      endIcon={<PersonAddIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ButtonColor
                      value={Colors.red}
                      label={t("commun.leave")}
                      variant="contained"
                      onClick={close}
                      endIcon={<CloseIcon />}
                    />
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
