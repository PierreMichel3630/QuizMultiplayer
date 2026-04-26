import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  selectChallengeAllTimePaginate,
  selectChallengeDayPaginate,
  selectChallengeMonthPaginate,
  selectChallengeWeekPaginate,
} from "src/api/challenge";
import { selectSoloGameByDate } from "src/api/game";
import { selectScore } from "src/api/score";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import {
  ChallengeAvg,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import {
  ClassementChallengeTimeEnum,
  ClassementScoreEnum,
  ClassementSoloTimeEnum,
} from "src/models/enum/ClassementEnum";
import { AllGameModeEnum } from "src/models/enum/GameEnum";
import { SoloGame } from "src/models/Game";
import { Score } from "src/models/Score";
import {
  GroupButtonAllGameMode,
  GroupButtonChallengeTime,
  GroupButtonTime,
  GroupButtonTypeGame,
} from "./button/ButtonGroup";
import { CellRankingChallengeDay, RecapAvgChallenge } from "./ChallengeBlock";
import { DataRanking, RankingTable } from "./table/RankingTable";

interface Props {
  themes?: Array<number>;
}

export const RankingBlock = ({ themes }: Props) => {
  const { language } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(ClassementScoreEnum.points);
  const [data, setData] = useState<Array<DataRanking>>([]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    const ids = themes ?? [];
    if (language) {
      selectScore(tab, 0, 3, language, ids).then(({ data }) => {
        const res = data as Array<Score>;
        const newdata = res.map((el, index) => {
          const champ = el[tab];
          return {
            profile: el.profile,
            value: Array.isArray(champ) ? champ.length : champ,
            theme: el.theme,
            rank: index + 1,
            size: 60,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    }
  }, [themes, tab, language]);

  return (
    <Grid container spacing={1}>
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
        size={12}
      >
        <GroupButtonTypeGame
          selected={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      </Grid>
      <Grid size={12}>
        <RankingTable data={data} loading={isLoading} />
      </Grid>
      <Grid size={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};

export const RankingTop5Block = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { hasPlayChallenge } = useAuth();

  const [tab, setTab] = useState(AllGameModeEnum.CHALLENGE);
  const [tabTimeSolo, setTabTimeSolo] = useState(ClassementSoloTimeEnum.week);
  const [tabTimeChallenge, setTabTimeChallenge] = useState(
    ClassementChallengeTimeEnum.day,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<DataRanking>>([]);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);
  const [count, setCount] = useState<null | number>(null);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    if (language) {
      if (tab === AllGameModeEnum.CHALLENGE) {
        if (tabTimeChallenge === ClassementChallengeTimeEnum.day) {
          selectChallengeDayPaginate(
            moment(),
            undefined,
            undefined,
            undefined,
            0,
            5,
          ).then(({ data }) => {
            const values: Array<any> = data.data;
            const avg: ChallengeAvg = data.avg;
            const count: number = data.total;
            const newdata = [...values].map((el) => {
              return {
                profile: el.profile,
                value: hasPlayChallenge ? (
                  <CellRankingChallengeDay value={el} />
                ) : (
                  <></>
                ),
                rank: el.ranking,
                size: hasPlayChallenge ? 65 : 1,
              };
            });
            setCount(count);
            setAvg(avg);
            setData(newdata);
            setIsLoading(false);
          });
        } else if (tabTimeChallenge === ClassementChallengeTimeEnum.week) {
          const date = moment().format("WW/YYYY");
          selectChallengeWeekPaginate(
            date,
            undefined,
            undefined,
            undefined,
            0,
            5,
          ).then(({ data }) => {
            const values: Array<ChallengeRankingWeek> = data.data;
            const avg: ChallengeAvg = data.avg;
            const count: number = data.total;
            const newdata = [...values].map((el) => {
              return {
                profile: el.profile,
                value: (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ width: px(80) }}>
                      <Typography variant="h6" noWrap>
                        {el.score} {t("commun.pointsabbreviation")} (
                        {el.scoreavg.toFixed(1)})
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: px(4),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {el.games}
                      </Typography>
                      <Typography variant="body1" noWrap>
                        {t("commun.games")}
                      </Typography>
                    </Box>
                  </Box>
                ),
                size: 90,
                rank: el.ranking,
              };
            });
            setCount(count);
            setAvg(avg);
            setData(newdata);
            setIsLoading(false);
          });
        } else if (tabTimeChallenge === ClassementChallengeTimeEnum.month) {
          selectChallengeMonthPaginate(
            moment().format("MM/YYYY"),
            undefined,
            undefined,
            undefined,
            0,
            5,
          ).then(({ data }) => {
            const values: Array<ChallengeRankingMonth> = data.data;
            const avg: ChallengeAvg = data.avg;
            const count: number = data.total;
            const newdata = [...values].map((el) => {
              return {
                profile: el.profile,
                value: (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ width: px(100) }}>
                      <Typography variant="h6" noWrap>
                        {el.score} {t("commun.pointsabbreviation")} (
                        {el.scoreavg.toFixed(1)})
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: px(4),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {el.games}
                      </Typography>
                      <Typography variant="body1" noWrap>
                        {t("commun.games")}
                      </Typography>
                    </Box>
                  </Box>
                ),
                size: 90,
                rank: el.ranking,
              };
            });
            setCount(count);
            setAvg(avg);
            setData(newdata);
            setIsLoading(false);
          });
        } else if (tabTimeChallenge === ClassementChallengeTimeEnum.alltime) {
          selectChallengeAllTimePaginate(
            undefined,
            undefined,
            undefined,
            0,
            5,
          ).then(({ data }) => {
            const values: Array<ChallengeRankingAllTime> = data.data;
            const avg: ChallengeAvg = data.avg;
            const count: number = data.total;
            const newdata = values.map((el) => {
              return {
                profile: el.profile,
                value: (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ width: px(100) }}>
                      <Typography variant="h6" noWrap>
                        {el.score} {t("commun.pointsabbreviation")} (
                        {el.scoreavg.toFixed(1)})
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: px(4),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {el.games}
                      </Typography>
                      <Typography variant="body1" noWrap>
                        {t("commun.games")}
                      </Typography>
                    </Box>
                  </Box>
                ),
                size: 100,
                rank: el.ranking,
              };
            });
            setCount(count);
            setAvg(avg);
            setData(newdata);
            setIsLoading(false);
          });
        }
      } else if (tab === AllGameModeEnum.DUEL) {
        selectScore("rank", 0, 5, language).then(({ data }) => {
          const res = data as Array<Score>;
          const newdata = res.map((el, index) => {
            const champ = el.rank;
            return {
              profile: el.profile,
              value: (
                <Typography variant="h2" noWrap>
                  {champ}
                </Typography>
              ),
              theme: el.theme,
              rank: index + 1,
              size: 70,
            };
          });
          setData(newdata);
          setIsLoading(false);
        });
      } else if (tab === AllGameModeEnum.SOLO) {
        let start: Moment | undefined = undefined;
        if (tabTimeSolo === ClassementSoloTimeEnum.month) {
          start = moment().subtract(1, "month");
        } else if (tabTimeSolo === ClassementSoloTimeEnum.week) {
          start = moment().subtract(1, "week");
        } else {
          start = undefined;
        }
        selectSoloGameByDate(language, 0, 5, start).then(({ data }) => {
          const res = data as Array<SoloGame>;
          const newdata = res.map((el, index) => {
            return {
              profile: el.profile,
              value: (
                <Typography variant="h2" noWrap>
                  {el.points}
                </Typography>
              ),
              theme: el.theme,
              rank: index + 1,
              size: 60,
            };
          });
          setData(newdata);
          setIsLoading(false);
        });
      }
    }
  }, [tab, tabTimeSolo, tabTimeChallenge, t, language, hasPlayChallenge]);

  const link = useMemo(() => {
    let res = "";
    if (tab === AllGameModeEnum.SOLO) {
      res = `/ranking?sort=points&time=${tabTimeSolo}`;
    } else if (tab === AllGameModeEnum.DUEL) {
      res = `/ranking?sort=rank`;
    } else if (tab === AllGameModeEnum.CHALLENGE) {
      res = `/challenge?time=${tabTimeChallenge}`;
    }
    return res;
  }, [tab, tabTimeSolo, tabTimeChallenge]);

  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} alignItems="center">
        <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
          <GroupButtonAllGameMode
            selected={tab}
            onChange={(value) => {
              setTab(value);
            }}
          />
        </Grid>
        {tab === AllGameModeEnum.SOLO && (
          <Grid size={12}>
            <GroupButtonTime
              selected={tabTimeSolo}
              onChange={(value) => {
                setTabTimeSolo(value);
              }}
            />
          </Grid>
        )}
        {tab === AllGameModeEnum.CHALLENGE && (
          <>
            <Grid size={12}>
              <GroupButtonChallengeTime
                type={ClassementChallengeTimeEnum}
                selected={tabTimeChallenge}
                onChange={(value) => {
                  setTabTimeChallenge(value as ClassementChallengeTimeEnum);
                }}
              />
            </Grid>
            {avg && count && (
              <Grid size={12}>
                <RecapAvgChallenge avg={avg} count={count} />
              </Grid>
            )}
          </>
        )}

        <Grid size={12}>
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
        </Grid>
      </Grid>
    </Container>
  );
};
