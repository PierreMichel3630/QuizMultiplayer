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
import { StatAccomplishmentWithRanking } from "src/models/Accomplishment";
import { ProfileBlock } from "../profile/ProfileBlock";
import { BarVictory } from "../chart/BarVictory";

interface Props {
  data?: StatAccomplishmentWithRanking;
  open: boolean;
  close: () => void;
}
export const RecapProfileAccomplishmentDialog = ({
  data,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();
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
              <Grid size={12} sx={{ textAlign: "center" }}>
                <Typography variant="h2">{t("commun.solo")}</Typography>
              </Grid>
              <Grid size={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1" component="span">
                  {t("commun.games")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.games}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.pointssolo")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.pointssolo}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.gameshundredpts")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.gameshundredpts}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.gamesfiftypts")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.gamesfiftypts}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.gamestwentypts")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.gamestwentypts}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.gamestenpts")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.gamestenpts}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.themetenpts")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.themetenpts.length}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  {t("commun.themetwentypts")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.themetwentypts.length}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12} sx={{ textAlign: "center" }}>
                <Typography variant="h2">{t("commun.duel")}</Typography>
              </Grid>
              <Grid size={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1" component="span">
                  {t("commun.games")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {data.duelgames}
                </Typography>
              </Grid>
              <Grid size={12}>
                <BarVictory
                  victory={data.victoryduel}
                  draw={data.drawduel}
                  defeat={data.defeatduel}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
