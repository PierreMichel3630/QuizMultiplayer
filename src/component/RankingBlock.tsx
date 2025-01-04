import { Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectGamesByTime } from "src/api/game";
import { selectScore } from "src/api/score";
import {
  ClassementScoreEnum,
  ClassementTimeEnum,
} from "src/models/enum/ClassementEnum";
import { HistorySoloGame } from "src/models/Game";
import { Score } from "src/models/Score";
import { GroupButtonTime, GroupButtonTypeGame } from "./button/ButtonGroup";
import { DataRanking, RankingTable } from "./table/RankingTable";

interface Props {
  themes?: Array<number>;
}
export const RankingBlock = ({ themes }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(ClassementScoreEnum.points);
  const [data, setData] = useState<Array<DataRanking>>([]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    const ids = themes ?? [];
    selectScore(tab, 0, 3, ids).then(({ data }) => {
      const res = data as Array<Score>;
      const newdata = res.map((el, index) => {
        const champ = el[tab];
        return {
          profile: el.profile,
          value: Array.isArray(champ) ? champ.length : champ,
          theme: el.theme,
          rank: index + 1,
        };
      });
      setData(newdata);
      setIsLoading(false);
    });
  }, [themes, tab]);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <GroupButtonTypeGame
          selected={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RankingTable data={data} loading={isLoading} />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};

export const RankingTop5Block = () => {
  const { t } = useTranslation();

  const [tab, setTab] = useState(ClassementScoreEnum.points);
  const [tabTime, setTabTime] = useState(ClassementTimeEnum.week);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<DataRanking>>([]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    if (
      tab === ClassementScoreEnum.rank ||
      (tab === ClassementScoreEnum.points &&
        tabTime === ClassementTimeEnum.alltime)
    ) {
      selectScore(tab, 0, 5).then(({ data }) => {
        const res = data as Array<Score>;
        const newdata = res.map((el, index) => {
          const champ = el[tab];
          return {
            profile: el.profile,
            value: Array.isArray(champ) ? champ.length : champ,
            theme: el.theme,
            rank: index + 1,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    } else {
      selectGamesByTime(tabTime, 5).then(({ data }) => {
        const res = data as Array<HistorySoloGame>;
        const newdata = res.map((el, index) => {
          return {
            profile: el.profile,
            value: el.points,
            theme: el.theme,
            rank: index + 1,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    }
  }, [tab, tabTime]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={6}>
        <Typography variant="h2">{t("commun.ranking")}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <GroupButtonTypeGame
          selected={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      </Grid>
      {tab === ClassementScoreEnum.points && (
        <Grid item xs={12}>
          <GroupButtonTime
            selected={tabTime}
            onChange={(value) => {
              setTabTime(value);
            }}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <RankingTable data={data} loading={isLoading} />
      </Grid>
    </Grid>
  );
};
