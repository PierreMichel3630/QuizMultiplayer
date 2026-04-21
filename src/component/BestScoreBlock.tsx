import { Grid, Typography } from "@mui/material";
import { important, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { ShareScoreIcon } from "./ShareApplicationBlock";
import { Order } from "src/models/enum/Order";
import { ChangeNumberBlock } from "./ChangeBlock";
import { TypeGameMode } from "src/models/enum/GameMode";
import { GameModeScore, OrderGameModeScore } from "src/models/GameMode";
import { getLeaderboardGameMode } from "src/api/gamemode";
import { Rank } from "./ranking/Rank";

interface PropsBestScoreBlockTheme {
  theme: Theme;
  points: number;
}
export const BestScoreBlockTheme = ({
  theme,
  points,
}: PropsBestScoreBlockTheme) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [myScore, setMyScore] = useState<Score | undefined>(undefined);

  useEffect(() => {
    const getScore = () => {
      if (theme && profile) {
        selectScoreByThemeAndPlayer(profile.id, theme.id).then(({ data }) => {
          const res = data as Score;
          setMyScore(res);
        });
      }
    };
    getScore();
  }, [theme, profile]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
        size={6}
      >
        <Typography variant="h6">{t("commun.score")} : </Typography>
        <Typography variant="h2" sx={{ fontSize: important(px(35)) }}>
          {points}
        </Typography>
        <ShareScoreIcon score={points} theme={theme} />
      </Grid>
      {myScore && (
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
          size={6}
        >
          <Typography variant="h6">{t("commun.bestscore")} : </Typography>
          <Typography variant="h2" sx={{ fontSize: important(px(35)) }}>
            {myScore.points}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

interface PropsBestScoreBlockGameMode {
  type: TypeGameMode;
  unit?: string;
  fixed?: number;
  order: Order;
}
export const BestScoreBlockGameMode = ({
  type,
  unit,
  order,
  fixed = 0,
}: PropsBestScoreBlockGameMode) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [myScore, setMyScore] = useState<GameModeScore | undefined>(undefined);

  useEffect(() => {
    const getScore = () => {
      if (type && profile) {
        getLeaderboardGameMode(
          type,
          "",
          0,
          1,
          OrderGameModeScore.SCORE,
          order,
          [profile.id],
        ).then(({ data }) => {
          if (data.length === 1) {
            setMyScore(data[0]);
          }
        });
      }
    };
    getScore();
  }, [type, profile, order]);

  return (
    <Grid container spacing={1} justifyContent="center">
      {myScore && (
        <>
          <Grid
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">{t("commun.position")} : </Typography>
            <Rank value={myScore.rank} />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
            size={12}
          >
            <Typography variant="body1">{t("commun.bestscore")} : </Typography>
            <Typography variant="h2">
              {myScore.score.toFixed(fixed)} {unit}
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};

interface Props {
  type: TypeGameMode;
  score?: number;
  previousscore?: number;
  unit?: string;
  order?: Order;
}
export const BestScoreBlock = ({
  type,
  score,
  previousscore,
  unit,
  order = Order.ASC,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [myScore, setMyScore] = useState<GameModeScore | undefined>(undefined);

  useEffect(() => {
    const getScore = () => {
      if (type && profile) {
        getLeaderboardGameMode(
          type,
          "",
          0,
          1,
          OrderGameModeScore.SCORE,
          order,
          [profile.id],
        ).then(({ data }) => {
          if (data.length === 1) {
            setMyScore(data[0]);
          }
        });
      }
    };
    getScore();
  }, [type, profile, order]);

  const bestscore = useMemo(() => {
    let result = undefined;
    if (score !== undefined && previousscore !== undefined) {
      if (order === Order.DESC) {
        result = Math.max(score, previousscore);
      } else {
        result = Math.min(score, previousscore);
      }
    }
    return result;
  }, [score, previousscore, order]);

  return (
    score !== undefined && (
      <Grid container spacing={1} justifyContent="center">
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
          size={{ xs: 12, md: 6 }}
        >
          <Typography variant="body1">{t("commun.score")} : </Typography>
          <Typography variant="h2">
            {score} {unit}
          </Typography>
          {previousscore !== undefined && (
            <ChangeNumberBlock
              value={score}
              previous={previousscore}
              variant="h6"
              order={order}
              unit={unit}
            />
          )}
        </Grid>
        {bestscore !== undefined && (
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
            size={{ xs: 12, md: 6 }}
          >
            <Typography variant="body1">{t("commun.bestscore")} : </Typography>
            <Typography variant="h2">
              {bestscore} {unit}
            </Typography>
          </Grid>
        )}
        {myScore?.rank && (
          <Grid
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">{t("commun.position")} : </Typography>
            <Rank value={myScore.rank} />
          </Grid>
        )}
      </Grid>
    )
  );
};
