import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { selectThemes } from "src/api/theme";
import { CardRanking } from "src/component/card/CardRanking";
import { useUser } from "src/context/UserProvider";
import { MyScore } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { uniqBy } from "lodash";
import { DonutGames } from "src/component/chart/DonutGames";

export const StatisticsPage = () => {
  const { t } = useTranslation();
  const { uuid } = useUser();

  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [myScores, setMyScores] = useState<Array<MyScore>>([]);

  const getThemes = () => {
    selectThemes().then((res) => {
      if (res.data) setThemes(res.data as Array<Theme>);
    });
  };

  useEffect(() => {
    getThemes();
  }, []);

  useEffect(() => {
    const getMyRank = () => {
      themes.forEach((theme) => {
        selectScoreByThemeAndPlayer(uuid, theme.id).then(({ data }) => {
          const res = data as MyScore;
          if (res.id)
            setMyScores((prev) => uniqBy([...prev, res], (el) => el.id));
        });
      });
    };
    getMyRank();
  }, [themes, uuid]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontSize: 30 }}>
          {t("commun.mystatistics")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <DonutGames stats={myScores} themes={themes} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="stretch">
          {themes.map((theme) => (
            <Grid item xs={12} sm={12} md={6} key={theme.id}>
              <CardRanking theme={theme} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
