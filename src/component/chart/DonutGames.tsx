import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { Score } from "src/models/Score";
import { sortByValue } from "src/utils/sort";
import { DonutChart } from "./DonutChart";
import { Paper, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Colors } from "src/style/Colors";
import { ToogleButtonCard } from "../ToogleButton";
import { px } from "csx";

interface Props {
  scores: Array<Score>;
}
export const DonutGames = ({ scores }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [type, setType] = useState<"solo" | "duel">("solo");
  const types = [
    { label: t("commun.solo"), value: "solo" },
    { label: t("commun.duel"), value: "duel" },
  ];

  const dataSolo = useMemo(
    () =>
      scores
        .map((score) => {
          const label = score.theme.name[language.iso]
            ? score.theme.name[language.iso]
            : score.theme.name["fr-FR"];
          return {
            name: label,
            value: score ? score.games : 0,
            color: score.theme.color,
          };
        })
        .sort(sortByValue),
    [scores, language.iso]
  );

  const dataDuel = useMemo(
    () =>
      scores
        .map((score) => {
          const label = score.theme.name[language.iso]
            ? score.theme.name[language.iso]
            : score.theme.name["fr-FR"];
          return {
            name: label,
            value: score ? score.duelgames : 0,
            color: score.theme.color,
          };
        })
        .sort(sortByValue),
    [scores, language.iso]
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
            backgroundColor: Colors.red,
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
          }}
        >
          <DonutChart data={data.filter((el) => el.value !== 0)} />
        </Grid>
      </Grid>
    </Paper>
  );
};
