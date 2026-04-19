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

interface Props {
  score?: number;
  previousscore?: number;
  unit?: string;
  order?: Order;
}
export const BestScoreBlock = ({
  score,
  previousscore,
  unit,
  order = Order.ASC,
}: Props) => {
  const { t } = useTranslation();

  const bestscore = useMemo(() => {
    let result = undefined;
    if (score !== undefined && previousscore !== undefined) {
      if (order === Order.ASC) {
        result = score > previousscore ? score : previousscore;
      } else {
        result = score < previousscore ? score : previousscore;
      }
    }
    return result;
  }, [score, previousscore, order]);

  return (
    previousscore !== undefined &&
    score !== undefined && (
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
            {score} {unit}
          </Typography>
          <ChangeNumberBlock
            value={score}
            previous={previousscore}
            variant="h6"
            order={order}
            unit={unit}
          />
        </Grid>
        {bestscore !== undefined && (
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
              {bestscore} {unit}
            </Typography>
          </Grid>
        )}
      </Grid>
    )
  );
};
