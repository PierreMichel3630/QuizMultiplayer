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
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectProfilById } from "src/api/profile";
import { ExperienceBlock } from "src/component/ExperienceBlock";
import ScrollTop from "src/component/navigation/ScrollToTop";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { ProfileAction } from "src/component/ProfileAction";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Profile } from "src/models/Profile";
import { TitleModal } from "./TitleModal";
import { MoneyBlock } from "src/component/MoneyBlock";

const BaseRecapDialogContext = createContext<{
  profile?: Profile;
  stat?: StatAccomplishment;
}>({
  profile: undefined,
  stat: undefined,
});

export const useBaseRecapDialog = () => useContext(BaseRecapDialogContext);

interface BaseRecapDialogProps {
  open: boolean;
  close: () => void;
  profileId?: string;
  children: ReactNode;
}

export const BaseRecapDialog = ({
  open,
  close,
  profileId,
  children,
}: BaseRecapDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  useEffect(() => {
    if (profileId) {
      selectStatAccomplishmentByProfile(profileId).then(({ data }) => {
        setStat(data ?? undefined);
      });
      selectProfilById(profileId).then(({ data }) => {
        setProfile(data ?? undefined);
      });
    }
  }, [profileId]);

  const isMe = useMemo(() => user && user.id === profile?.id, [user, profile]);

  const contextValue = useMemo(
    () => ({
      profile,
      stat,
    }),
    [profile, stat],
  );

  return (
    <BaseRecapDialogContext.Provider value={contextValue}>
      <Dialog onClose={close} open={open} maxWidth="md" fullScreen={fullScreen}>
        <TitleModal title={t("commun.result")} close={close} />
        <DialogContent
          ref={dialogContentRef}
          sx={{ p: 2,  position: "relative", overflowY: "auto" }}
        >
          <div ref={topAnchorRef} />
          <Grid container spacing={1} sx={{mb: 5}}>
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
                {stat && (
                  <Grid size={12}>
                    <ExperienceBlock xp={stat.xp} />
                  </Grid>
                )}
                {profile && (
                  <Grid size={12} sx={{display: "flex", justifyContent: "center"}}>
                    <MoneyBlock money={profile.money} />
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
    </BaseRecapDialogContext.Provider>
  );
};
