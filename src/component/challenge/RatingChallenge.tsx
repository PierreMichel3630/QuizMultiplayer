import { Grid, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  selectChallengeGameByProfileIdGroupByRanking,
  selectChallengeGameByProfileIdGroupByRating,
} from "src/api/challenge";
import { Colors } from "src/style/Colors";
import { Data, RatingChart } from "../chart/RatingChart";
import { ToogleButtonCard } from "../ToogleButton";

export const RatingChallenge = () => {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const [type, setType] = useState<"grade" | "position">("grade");
  const types = [
    { label: t("chart.grade"), value: "grade" },
    { label: t("chart.position"), value: "position" },
  ];

  const colors = useMemo(
    () => [
      Colors.brown,
      Colors.purple,
      Colors.red2,
      Colors.red,
      Colors.orange2,
      Colors.orange,
      Colors.yellow2,
      Colors.yellow,
      Colors.green2,
      Colors.green,
      Colors.green3,
    ],
    []
  );

  const [data, setData] = useState<Array<Data>>([]);

  useEffect(() => {
    const getStatDay = () => {
      if (uuid) {
        if (type === "grade") {
          selectChallengeGameByProfileIdGroupByRating(uuid).then(({ data }) => {
            const ratingPlayer: Array<any> = data ?? [];
            const rating = Array.from(Array(11).keys());
            const result: Array<Data> = [...rating].map((el) => {
              const value = ratingPlayer.find((d) => d.label === el);
              return value
                ? { label: value.label, value: value.value, color: colors[el] }
                : { label: el, value: 0, color: Colors.black };
            });
            setData(result);
          });
        } else {
          selectChallengeGameByProfileIdGroupByRanking(uuid).then(
            ({ data }) => {
              const values = [
                { label: t("chart.top1"), min: 1, max: 1 },
                { label: t("chart.top3"), min: 2, max: 3 },
                { label: t("chart.top5"), min: 4, max: 5 },
                { label: t("chart.top10"), min: 6, max: 10 },
                { label: t("chart.other"), min: 11, max: 10000000 },
              ];
              const rankingPlayer: Array<any> = data ?? [];
              const result: Array<Data> = [...values].map((el) => {
                const value = [...rankingPlayer]
                  .filter((d) => el.min <= d.label && el.max >= d.label)
                  .reduce((acc, v) => acc + v.value, 0);
                return {
                  label: el.label,
                  value: value,
                  color: Colors.blue,
                };
              });
              setData(result);
            }
          );
        }
      }
    };
    getStatDay();
  }, [colors, uuid, type, t]);

  return (
    <Paper
      sx={{
        backgroundColor: Colors.grey,
        overflow: "hidden",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.colorApp,
            p: px(5),
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("chart.distribution")}</Typography>
          <ToogleButtonCard
            select={type}
            onChange={(value) => setType(value as "grade" | "position")}
            values={types}
          />
        </Grid>
        <Grid item xs={12} sx={{ p: px(5) }}>
          <RatingChart data={data} />
        </Grid>
      </Grid>
    </Paper>
  );
};
