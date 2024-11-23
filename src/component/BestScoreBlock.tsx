import { Grid, Typography } from "@mui/material";
import { important, px } from "csx";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ShareScoreIcon } from "./ShareApplicationBlock";

interface Props {
  theme: Theme;
  points: number;
}
export const BestScoreBlock = ({ theme, points }: Props) => {
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
        item
        xs={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: Colors.white }}>
          {t("commun.score")} :{" "}
        </Typography>
        <Typography
          variant="h2"
          sx={{ color: Colors.white, fontSize: important(px(35)) }}
        >
          {points}
        </Typography>
        <ShareScoreIcon score={points} theme={theme} />
      </Grid>
      {myScore && (
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: Colors.white }}>
            {t("commun.bestscore")} :{" "}
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: Colors.white, fontSize: important(px(35)) }}
          >
            {myScore.points}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
