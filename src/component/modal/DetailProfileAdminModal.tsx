import {
  AppBar,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { important } from "csx";
import { Profile, ProfileAccount } from "src/models/Profile";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectProfileAccountByProfile } from "src/api/profile";
import { NoResultAlert } from "../alert/NoResultAlert";
import { ProfileAdminBlock } from "../profile/ProfileBlock";
import { SkeletonPlayers } from "../skeleton/SkeletonPlayer";

interface Props {
  open: boolean;
  close: () => void;
  profile?: Profile;
}

export const DetailProfileAdminModal = ({ open, close, profile }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [profiles, setProfiles] = useState<Array<ProfileAccount>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setLoading(true);
      selectProfileAccountByProfile(profile.id).then(({ data }) => {
        setProfiles(data ?? []);
        setLoading(false);
      });
    }
  }, [profile]);

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar sx={{ minHeight: important("auto") }}>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("modal.detailaccount")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 1 }}>
        <Grid container spacing={1}>
          {profile && (
            <>
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ProfileAdminBlock
                  variant="h6"
                  profile={profile}
                  avatarSize={45}
                />
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
            </>
          )}
          <Grid size={12}>
            <Typography variant="h4">{t("commun.profileconnect")}</Typography>
          </Grid>
          {loading ? (
            <SkeletonPlayers number={2} />
          ) : (
            <>
              {profiles.length > 0 ? (
                profiles.map((value) => (
                  <Grid size={12} key={value.profileconnect.id}>
                    <ProfileAdminBlock
                      variant="h6"
                      profile={value.profileconnect}
                      avatarSize={30}
                    />
                  </Grid>
                ))
              ) : (
                <Grid size={12}>
                  <NoResultAlert />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
