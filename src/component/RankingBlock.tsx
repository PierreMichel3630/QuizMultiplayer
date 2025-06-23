import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  selectAvgChallengeByAllTime,
  selectAvgChallengeByDateAndLanguage,
  selectAvgChallengeByMonth,
  selectAvgChallengeByWeek,
  selectRankingChallengeAllTimePaginate,
  selectRankingChallengeByDatePaginate,
  selectRankingChallengeByMonthPaginate,
  selectRankingChallengeByWeekPaginate,
} from "src/api/challenge";
import { selectGamesByTime } from "src/api/game";
import { selectScore } from "src/api/score";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
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
import { Score } from "src/models/Score";
import {
  GroupButtonAllGameMode,
  GroupButtonChallengeTime,
  GroupButtonTime,
  GroupButtonTypeGame,
} from "./button/ButtonGroup";
import { DataRanking, RankingTable } from "./table/RankingTable";
import { useUser } from "src/context/UserProvider";
import { RecapAvgChallenge } from "./ChallengeBlock";

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
    selectScore(tab, 0, 3, language.iso, ids).then(({ data }) => {
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
  }, [themes, tab, language]);

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
  const { language, hasChallenge } = useUser();

  const [tab, setTab] = useState(AllGameModeEnum.CHALLENGE);
  const [tabTimeSolo, setTabTimeSolo] = useState(ClassementSoloTimeEnum.week);
  const [tabTimeChallenge, setTabTimeChallenge] = useState(
    ClassementChallengeTimeEnum.day
  );
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<DataRanking>>([]);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);

  useEffect(() => {
    setTab(hasChallenge ? AllGameModeEnum.CHALLENGE : AllGameModeEnum.SOLO);
  }, [hasChallenge]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    if (tab === AllGameModeEnum.CHALLENGE) {
      if (tabTimeChallenge === ClassementChallengeTimeEnum.day) {
        selectRankingChallengeByDatePaginate(moment(), language.iso).then(
          ({ data }) => {
            const res: Array<any> = data ?? [];
            const newdata = res.map((el) => {
              return {
                profile: el.profile,
                value: (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                      width: px(60),
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
                size: 65,
              };
            });
            setData(newdata);
            setIsLoading(false);
          }
        );
      } else if (tabTimeChallenge === ClassementChallengeTimeEnum.week) {
        selectRankingChallengeByWeekPaginate(moment().format("WW/YYYY")).then(
          ({ data }) => {
            const res = (data ?? []) as Array<ChallengeRankingWeek>;
            const newdata = res.map((el) => {
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
            setData(newdata);
            setIsLoading(false);
          }
        );
      } else if (tabTimeChallenge === ClassementChallengeTimeEnum.month) {
        selectRankingChallengeByMonthPaginate(moment().format("MM/YYYY")).then(
          ({ data }) => {
            const res = (data ?? []) as Array<ChallengeRankingMonth>;
            const newdata = res.map((el) => {
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
            setData(newdata);
            setIsLoading(false);
          }
        );
      } else if (tabTimeChallenge === ClassementChallengeTimeEnum.alltime) {
        selectRankingChallengeAllTimePaginate().then(({ data }) => {
          const res = (data ?? []) as Array<ChallengeRankingAllTime>;
          const newdata = res.map((el) => {
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
          setData(newdata);
          setIsLoading(false);
        });
      }
    } else if (tab === AllGameModeEnum.DUEL) {
      selectScore("rank", 0, 5, language.iso).then(({ data }) => {
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
      if (tabTimeSolo === ClassementSoloTimeEnum.alltime) {
        selectScore("points", 0, 5, language.iso).then(({ data }) => {
          const res = data as Array<Score>;
          const newdata = res.map((el, index) => {
            const champ = el.points;
            return {
              profile: el.profile,
              value: (
                <Typography variant="h2" noWrap>
                  {Array.isArray(champ) ? champ.length : champ}
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
      } else {
        selectGamesByTime(tabTimeSolo, 0, 5, language.iso).then(({ data }) => {
          const res: Array<any> = data ?? [];
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
  }, [tab, tabTimeSolo, tabTimeChallenge, t, language]);

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

  useEffect(() => {
    const getAvg = () => {
      if (tab === AllGameModeEnum.CHALLENGE) {
        const date = moment();
        if (tabTimeChallenge === ClassementChallengeTimeEnum.day) {
          selectAvgChallengeByDateAndLanguage(date, language.iso).then(
            ({ data }) => {
              setAvg(data);
            }
          );
        } else if (tabTimeChallenge === ClassementChallengeTimeEnum.week) {
          selectAvgChallengeByWeek(date).then(({ data }) => {
            setAvg(data);
          });
        } else if (tabTimeChallenge === ClassementChallengeTimeEnum.month) {
          selectAvgChallengeByMonth(date).then(({ data }) => {
            setAvg(data);
          });
        } else if (tabTimeChallenge === ClassementChallengeTimeEnum.alltime) {
          selectAvgChallengeByAllTime().then(({ data }) => {
            setAvg(data);
          });
        }
      } else {
        setAvg(null);
      }
    };
    getAvg();
  }, [tab, tabTimeChallenge, language.iso]);

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
            selected={tabTimeSolo}
            onChange={(value) => {
              setTabTimeSolo(value);
            }}
          />
        </Grid>
      )}
      {tab === AllGameModeEnum.CHALLENGE && (
        <Grid item xs={12}>
          <GroupButtonChallengeTime
            selected={tabTimeChallenge}
            onChange={(value) => {
              setTabTimeChallenge(value);
            }}
          />
        </Grid>
      )}
      {avg && (
        <Grid item xs={12}>
          <RecapAvgChallenge avg={avg} />
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
