import { Grid, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { Score } from "src/models/Score";
import { Colors } from "src/style/Colors";
import { sortByDuelGamesDesc, sortByGamesDesc } from "src/utils/sort";
import { ToogleButtonCard } from "../ToogleButton";
import { DonutChart } from "./DonutChart";
import { BarVictory } from "./BarVictory";

interface Props {
  scores: Array<Score>;
  totalScore: { victory: number; draw: number; defeat: number };
  totalSolo: number;
}
export const DonutGames = ({ scores, totalScore, totalSolo }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const MAXVALUEDISPLAY = 5;

  const [type, setType] = useState<"solo" | "duel">("solo");
  const types = [
    { label: t("commun.solo"), value: "solo" },
    { label: t("commun.duel"), value: "duel" },
  ];

  const dataSolo = useMemo(
    () =>
      scores.sort(sortByGamesDesc).reduce(
        (acc, score, index) => {
          if (index + 1 <= MAXVALUEDISPLAY) {
            const label = score.theme.name[language.iso]
              ? score.theme.name[language.iso]
              : score.theme.name["fr-FR"];
            return [
              ...acc,
              {
                name: label,
                value: score ? score.games : 0,
                color: score.theme.color,
              },
            ];
          } else {
            const other = { ...acc[0], value: acc[0].value + score.games };
            return [other, ...acc.filter((_el, index) => index !== 0)];
          }
        },
        [
          {
            name: t("commun.others"),
            value: 0,
            color: Colors.black,
          },
        ]
      ),
    [scores, t, language.iso]
  );

  const dataDuel = useMemo(
    () =>
      scores.sort(sortByDuelGamesDesc).reduce(
        (acc, score, index) => {
          if (index + 1 <= MAXVALUEDISPLAY) {
            const label = score.theme.name[language.iso]
              ? score.theme.name[language.iso]
              : score.theme.name["fr-FR"];
            return [
              ...acc,
              {
                name: label,
                value: score ? score.duelgames : 0,
                color: score.theme.color,
              },
            ];
          } else {
            const other = { ...acc[0], value: acc[0].value + score.duelgames };
            return [other, ...acc.filter((_el, index) => index !== 0)];
          }
        },
        [
          {
            name: t("commun.others"),
            value: 0,
            color: Colors.black,
          },
        ]
      ),
    [scores, t, language.iso]
  );

  const data = useMemo(
    () => (type === "solo" ? dataSolo : dataDuel),
    [dataSolo, dataDuel, type]
  );

  return (
    <Paper sx={{ overflow: "hidden", backgroundColor: Colors.lightgrey }}>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.blue3,
            p: px(5),
          }}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <Typography
                variant="h2"
                sx={{
                  wordWrap: "break-word",
                  fontSize: 18,
                }}
                color="text.secondary"
              >
                {t("commun.gamesplay")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <ToogleButtonCard
                select={type}
                onChange={(value) => setType(value as "solo" | "duel")}
                values={types}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.grey,
            display: "flex",
            p: 1,
          }}
        >
          <Grid container spacing={1}>
            {type === "duel" ? (
              <>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="body1" component="span">
                    {t("commun.games")} {" : "}
                  </Typography>
                  <Typography variant="h4" component="span">
                    {totalScore.victory + totalScore.draw + totalScore.defeat}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <BarVictory
                    victory={totalScore.victory}
                    draw={totalScore.draw}
                    defeat={totalScore.defeat}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1" component="span">
                  {t("commun.games")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {totalSolo}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <DonutChart data={data.filter((el) => el.value !== 0)} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
