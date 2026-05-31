import CloseIcon from "@mui/icons-material/Close";
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
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { ExperienceBlock } from "src/component/ExperienceBlock";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { ProfileAction } from "src/component/ProfileAction";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Profile } from "src/models/Profile";

interface BaseRecapDialogProps {
  open: boolean;
  close: () => void;
  profile?: Profile;
  children: ReactNode;
}

export const BaseRecapDialog = ({
  open,
  close,
  profile,
  children,
}: BaseRecapDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [xp, setXp] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (profile) {
      selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
        setXp(data ? data.xp : undefined);
      });
    }
  }, [profile]);

  const isMe = useMemo(
    () => user && profile && user.id === profile.id,
    [user, profile],
  );

  return (
    <Dialog onClose={close} open={open} maxWidth="md" fullScreen={fullScreen}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.result")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={1}>
          {profile && (
            <>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link
                  to={`/profil/${profile.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ProfileBlock profile={profile} />
                </Link>
              </Grid>
              {xp !== undefined && (
                <Grid size={12}>
                  <ExperienceBlock xp={xp} />
                </Grid>
              )}
              <Grid size={12}>
                <Divider />
              </Grid>
              {!isMe && (
                <>
                  <Grid size={12}>
                    <ProfileAction profileUser={profile} />
                  </Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                </>
              )}
            </>
          )}
          {children}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
