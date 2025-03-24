import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectRankingChallengeByDate } from "src/api/challenge";
import { selectGamesByTime } from "src/api/game";
import { selectScore } from "src/api/score";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { ChallengeRanking } from "src/models/Challenge";
import {
  ClassementScoreEnum,
  ClassementTimeEnum,
} from "src/models/enum/ClassementEnum";
import { AllGameModeEnum } from "src/models/enum/GameEnum";
import { HistorySoloGame } from "src/models/Game";
import { Score } from "src/models/Score";
import {
  GroupButtonAllGameMode,
  GroupButtonTime,
  GroupButtonTypeGame,
} from "./button/ButtonGroup";
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

  const [tab, setTab] = useState(AllGameModeEnum.CHALLENGE);
  const [tabTime, setTabTime] = useState(ClassementTimeEnum.week);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<DataRanking>>([]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    if (tab === AllGameModeEnum.CHALLENGE) {
      selectRankingChallengeByDate(moment(), 0, 5).then(({ data }) => {
        const res = (data ?? []) as Array<ChallengeRanking>;
        const newdata = res.map((el) => {
          return {
            profile: el.profile,
            value: (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" noWrap>
                  {el.score} / {NUMBER_QUESTIONS_CHALLENGE}
                </Typography>
                <Typography variant="h6" noWrap>
                  {(el.time / 1000).toFixed(2)}s
                </Typography>
              </Box>
            ),
            rank: el.ranking,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    } else if (
      tab === AllGameModeEnum.DUEL ||
      (tab === AllGameModeEnum.SOLO && tabTime === ClassementTimeEnum.alltime)
    ) {
      const value = AllGameModeEnum.DUEL ? "rank" : "points";
      selectScore(value, 0, 5).then(({ data }) => {
        const res = data as Array<Score>;
        const newdata = res.map((el, index) => {
          const champ = el[value];
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
      selectGamesByTime(tabTime, 0, 5).then(({ data }) => {
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

  const link = useMemo(() => {
    let res = "";
    if (tab === AllGameModeEnum.SOLO) {
      res = `/ranking?sort=points&time=${tabTime}`;
    } else if (tab === AllGameModeEnum.DUEL) {
      res = `/ranking?sort=rank`;
    } else if (tab === AllGameModeEnum.CHALLENGE) {
      res = `/challenge`;
    }
    return res;
  }, [tab, tabTime]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <GroupButtonAllGameMode
          selected={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      </Grid>
      {tab === AllGameModeEnum.SOLO && (
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
        <Container maxWidth="sm">
          <Box sx={{ p: 1 }}>
            <RankingTable
              data={data}
              loading={isLoading}
              navigation={{
                link: link,
                label: t("commun.seemore"),
              }}
            />
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};
