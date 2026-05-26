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
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { ProfileWithRanking } from "src/models/Profile";
import { MoneyArrondieBlock } from "../MoneyBlock";
import { ProfileBlock } from "../profile/ProfileBlock";
import { StreakBlock } from "../StreakBlock";

interface Props {
  data?: ProfileWithRanking;
  open: boolean;
  close: () => void;
}
export const RecapProfileDialog = ({ data, open, close }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
        <Grid container spacing={2}>
          {data && (
            <>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ProfileBlock profile={data.profile} />
                <Link to={`/profil/${data.profile.id}`}>
                  <Typography variant="body1">
                    {t("commun.seeprofile")}
                  </Typography>
                </Link>
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6">{t("commun.money")} :</Typography>
                <MoneyArrondieBlock money={data.money} language={language} />
              </Grid>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6">
                  {t("commun.currentstreak")} :
                </Typography>
                <StreakBlock value={data.streak} />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
