import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Dialog,
  DialogContent,
  Divider,
  Fab,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { percent } from "csx";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { ExperienceBlock } from "src/component/ExperienceBlock";
import ScrollTop from "src/component/navigation/ScrollToTop";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { ProfileAction } from "src/component/ProfileAction";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Profile } from "src/models/Profile";
import { TitleModal } from "./TitleModal";

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

  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const [xp, setXp] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (profile) {
      selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
        setXp(data ? data.xp : undefined);
      });
    }
  }, [profile]);

  const isMe = useMemo(() => user && user.id === profile?.id, [user, profile]);

  return (
    <Dialog onClose={close} open={open} maxWidth="md" fullScreen={fullScreen}>
      <TitleModal title={t("commun.result")} close={close} />
      <DialogContent
        ref={dialogContentRef}
        sx={{ p: 2, position: "relative", overflowY: "auto" }}
      >
        <div ref={topAnchorRef} />
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
                  style={{ textDecoration: "none", width: percent(100) }}
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
          <Grid size={12}>{children}</Grid>
        </Grid>
        <ScrollTop
          window={() => dialogContentRef.current}
          anchorRef={topAnchorRef}
        >
          <Fab size="small">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </DialogContent>
    </Dialog>
  );
};
