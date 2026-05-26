import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProfilById } from "src/api/profile";
import { selectScoreByProfileAndThemePaginate } from "src/api/score";
import { Page } from "src/models/Paginate";
import { Profile } from "src/models/Profile";
import { ScoreAvg, ScoreRanking } from "src/models/Score";
import { ProfileBlock } from "../profile/ProfileBlock";
import { RecapAvgGame, ScoreRankingBlock, Type } from "../ranking/RankGame";
import { Link } from "react-router-dom";

interface Props {
  profileId?: string;
  themeId?: number;
  open: boolean;
  close: () => void;
}
export const RecapProfileGameDialog = ({
  profileId,
  themeId,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [profile, setProfile] = useState<Profile | null>(null);

  const [scoreDuel, setScoreDuel] = useState<ScoreRanking | null>(null);
  const [avgDuel, setAvgDuel] = useState<ScoreAvg | null>(null);
  const [totalDuel, setTotalDuel] = useState<number | null>(null);

  const [scoreSolo, setScoreSolo] = useState<ScoreRanking | null>(null);
  const [avgSolo, setAvgSolo] = useState<ScoreAvg | null>(null);
  const [totalSolo, setTotalSolo] = useState<number | null>(null);

  const getScore = (profileId: string, theme: number) => {
    selectScoreByProfileAndThemePaginate(profileId, theme, "points").then(
      ({ data }) => {
        const result = data as Page<ScoreRanking, ScoreAvg>;
        setScoreSolo(result.data[0] ?? null);
        setAvgSolo(result.avg ?? null);
        setTotalSolo(result.total ?? null);
      },
    );

    selectScoreByProfileAndThemePaginate(profileId, theme, "rank").then(
      ({ data }) => {
        const result = data as Page<ScoreRanking, ScoreAvg>;
        setScoreDuel(result.data[0] ?? null);
        setAvgDuel(result.avg ?? null);
        setTotalDuel(result.total ?? null);
      },
    );
  };

  useEffect(() => {
    if (profileId) {
      getProfilById(profileId).then(({ data }) => {
        setProfile(data);
      });
    }
  }, [themeId, profileId]);

  useEffect(() => {
    if (profileId && themeId) {
      getScore(profileId, themeId);
    }
  }, [themeId, profileId]);

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
                <ProfileBlock profile={profile} />
                <Link to={`/profil/${profile.id}`}>
                  <Typography variant="body1">
                    {t("commun.seeprofile")}
                  </Typography>
                </Link>
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
            </>
          )}
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("commun.solo")}</Typography>
          </Grid>
          {avgSolo !== null && totalSolo !== null && (
            <Grid size={12}>
              <RecapAvgGame type={Type.solo} avg={avgSolo} count={totalSolo} />
            </Grid>
          )}
          {scoreSolo === null ? (
            <Grid size={12}>
              <Alert severity="warning">{t("alert.noresultgame")}</Alert>
            </Grid>
          ) : (
            <Grid size={12}>
              <ScoreRankingBlock value={scoreSolo} type={Type.solo} />
            </Grid>
          )}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("commun.duel")}</Typography>
          </Grid>
          {avgDuel !== null && totalDuel !== null && (
            <Grid size={12}>
              <RecapAvgGame type={Type.duel} avg={avgDuel} count={totalDuel} />
            </Grid>
          )}
          {scoreDuel === null ? (
            <Grid size={12}>
              <Alert severity="warning">{t("alert.noresultgame")}</Alert>
            </Grid>
          ) : (
            <Grid size={12}>
              <ScoreRankingBlock value={scoreDuel} type={Type.duel} />
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
