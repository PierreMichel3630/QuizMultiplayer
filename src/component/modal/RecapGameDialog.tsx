import { Alert, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProfilById } from "src/api/profile";
import { selectScoreByProfileAndThemePaginate } from "src/api/score";
import { Page } from "src/models/Paginate";
import { Profile } from "src/models/Profile";
import { ScoreAvg, ScoreRanking } from "src/models/Score";
import { RecapAvgGame, ScoreRankingBlock, Type } from "../ranking/RankGame";
import { BaseRecapDialog } from "./commun/BaseRecapDialog";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  profileId?: string;
  theme?: Theme;
  open: boolean;
  close: () => void;
}
export const RecapProfileGameDialog = ({
  profileId,
  theme,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();

  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  const [scoreDuel, setScoreDuel] = useState<ScoreRanking | null>(null);
  const [avgDuel, setAvgDuel] = useState<ScoreAvg | null>(null);
  const [totalDuel, setTotalDuel] = useState<number | null>(null);

  const [scoreSolo, setScoreSolo] = useState<ScoreRanking | null>(null);
  const [avgSolo, setAvgSolo] = useState<ScoreAvg | null>(null);
  const [totalSolo, setTotalSolo] = useState<number | null>(null);

  const themeId = useMemo(() => theme?.id, [theme]);

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
    <BaseRecapDialog open={open} close={close} profile={profile}>
      {theme && (
        <Grid
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          size={12}
        >
          <ImageThemeBlock theme={theme} size={40} />
          <TextNameBlock
            variant="h4"
            sx={{ textAlign: "center" }}
            values={theme.themetranslation}
          />
        </Grid>
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
    </BaseRecapDialog>
  );
};
