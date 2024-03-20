import { Avatar, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  selectScoreByThemeAndPlayer,
  selectScoresByTheme,
} from "src/api/score";
import { useUser } from "src/context/UserProvider";
import { MyScore, Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { ToogleButtonCard } from "../ToogleButton";
import { RankingTable } from "../table/RankingTable";

interface Props {
  theme: Theme;
}

export const CardRanking = ({ theme }: Props) => {
  const { t } = useTranslation();
  const { uuid } = useUser();

  const [scores, setScore] = useState<Array<Score>>([]);
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);
  const [type, setType] = useState<"points" | "games">("points");
  const types = [
    { label: t("commun.games"), value: "games" },
    { label: t("commun.score"), value: "points" },
  ];

  useEffect(() => {
    const getScore = () => {
      selectScoresByTheme(theme.id, type).then(({ data }) => {
        setScore(data as Array<Score>);
      });
    };
    getScore();
  }, [theme, type]);

  useEffect(() => {
    const getMyRank = () => {
      selectScoreByThemeAndPlayer(uuid, theme.id).then(({ data }) => {
        const res = data as MyScore;
        setMyScore(res.id !== null ? res : undefined);
      });
    };
    getMyRank();
  }, [theme, uuid]);

  return (
    <Paper>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.purple,
            p: 1,
          }}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid
              item
              xs={7}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Avatar src={theme.image} sx={{ width: 40, height: 40 }} />
              <JsonLanguageBlock
                variant="h1"
                sx={{
                  wordWrap: "anywhere",
                  fontSize: 22,
                  color: Colors.white,
                }}
                value={theme.name}
              />
            </Grid>
            <Grid
              item
              xs={5}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <ToogleButtonCard
                select={type}
                onChange={(value) => setType(value as "points" | "games")}
                values={types}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <RankingTable scores={scores} myscore={myScore} type={type} />
        </Grid>
      </Grid>
    </Paper>
  );
};
