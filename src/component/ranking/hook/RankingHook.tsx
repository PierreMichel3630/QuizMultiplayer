import { TableCell, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { px } from "csx";
import moment, { Moment } from "moment";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  selectChallengeAllTimePaginate,
  selectChallengeDayPaginate,
  selectChallengeMonthPaginate,
  selectChallengeWeekPaginate,
} from "src/api/challenge";
import { CellRankingChallengeDay } from "src/component/ChallengeBlock";
import { DataRankingChallenge } from "src/component/table/RankingTable";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import {
  ChallengeAvg,
  ChallengeRankingAllTime,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import {
  ClassementChallengeGlobalTimeEnum,
  ClassementChallengeTimeEnum,
} from "src/models/enum/ClassementEnum";

interface Sort {
  value: string;
  ascending: boolean;
}

interface Query {
  date: Moment;
  page: number;
  rowsPerPage: number;
  search: string;
  isOnlyFriend: boolean;
  friends?: Array<string>;
  sort: Sort;
  multicompte?: boolean;
}

export interface QueryPerDate extends Query {
  typeperdate: ClassementChallengeTimeEnum;
}

export interface QueryPerDate extends Query {
  typeperdate: ClassementChallengeTimeEnum;
}

export const useRankingChallengePerDate = (itemPerPage = 10) => {
  const { t } = useTranslation();
  const { profile, hasPlayChallenge } = useAuth();

  const { language } = useUser();

  const [query, setQuery] = useState<QueryPerDate>({
    date: moment(),
    typeperdate: ClassementChallengeTimeEnum.day,
    page: 0,
    rowsPerPage: itemPerPage,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    multicompte: false,
    sort: { value: "score", ascending: false },
  });

  const [avg, setAvg] = useState<ChallengeAvg | null>(null);
  const [count, setCount] = useState<null | number>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number | null>(null);
  const [data, setData] = useState<DataRankingChallenge[]>([]);

  const sorts = useMemo(
    () =>
      query.typeperdate === ClassementChallengeTimeEnum.day
        ? [
            {
              value: "score",
              label: t("sort.score"),
              sort: () =>
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  sort: { value: "score", ascending: false },
                })),
            },
            {
              value: "time",
              label: t("sort.time"),
              sort: () =>
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  sort: { value: "time", ascending: true },
                })),
            },
          ]
        : [
            {
              value: "score",
              label: t("sort.score"),
              sort: () =>
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  sort: { value: "score", ascending: false },
                })),
            },
            {
              value: "time",
              label: t("sort.time"),
              sort: () =>
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  sort: { value: "time", ascending: true },
                })),
            },
            {
              value: "pointsavg",
              label: t("sort.pointsavg"),
              sort: () =>
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  sort: { value: "scoreavg", ascending: false },
                })),
            },
            {
              value: "games",
              label: t("sort.games"),
              sort: () =>
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  sort: { value: "games", ascending: false },
                })),
            },
          ],
    [t, query],
  );

  useEffect(() => {
    const getRanking = () => {
      if (query.typeperdate === ClassementChallengeTimeEnum.day) {
        if (language) {
          selectChallengeDayPaginate(
            query.date,
            query.search,
            query.sort.value,
            query.sort.ascending,
            query.page,
            query.rowsPerPage,
            query.friends,
            query.multicompte,
          ).then(({ data }) => {
            const values: Array<ChallengeRankingDay> = data.data;
            const count: number = data.count;
            const total: number = data.total;
            const avg: ChallengeAvg = data.avg;
            const canSeeDayChallenge =
              hasPlayChallenge ||
              query.date.diff(moment(), "day") < 0 ||
              profile?.isadmin;
            const newdata = values.map((el) => {
              return {
                profile: el.profile,
                value: canSeeDayChallenge ? (
                  <TableCell
                    sx={{
                      p: px(4),
                      color: "inherit",
                    }}
                    width={70}
                  >
                    <CellRankingChallengeDay value={el} />
                  </TableCell>
                ) : (
                  <></>
                ),
                rank: el.ranking,
              };
            });
            setCount(count);
            setTotal(total);
            setAvg(avg);
            setData(newdata);
            setLoading(false);
          });
        }
      } else if (query.typeperdate === ClassementChallengeTimeEnum.month) {
        selectChallengeMonthPaginate(
          query.date.format("MM/YYYY"),
          query.search,
          query.sort.value,
          query.sort.ascending,
          query.page,
          query.rowsPerPage,
          query.friends,
          query.multicompte,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingMonth> = data.data;
          const count: number = data.count;
          const total: number = data.total;
          const avg: ChallengeAvg = data.avg;
          const newdata = values.map((el) => {
            return {
              profile: el.profile,
              value: (
                <TableCell
                  sx={{
                    p: px(4),
                    color: "inherit",
                  }}
                  width={92}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" noWrap>
                        {el.score} {t("commun.pointsabbreviation")} (
                        {el.scoreavg.toFixed(1)})
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {(el.time / 1000).toFixed(2)}s
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
                </TableCell>
              ),
              rank: el.ranking,
            };
          });
          setCount(count);
          setTotal(total);
          setAvg(avg);
          setData(newdata);
          setLoading(false);
        });
      } else if (query.typeperdate === ClassementChallengeTimeEnum.week) {
        selectChallengeWeekPaginate(
          query.date.format("WW/YYYY"),
          query.search,
          query.sort.value,
          query.sort.ascending,
          query.page,
          query.rowsPerPage,
          query.friends,
          query.multicompte,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingWeek> = data.data;
          const count: number = data.count;
          const total: number = data.total;
          const avg: ChallengeAvg = data.avg;
          const newdata = values.map((el) => {
            return {
              profile: el.profile,
              value: (
                <TableCell
                  sx={{
                    p: px(4),
                    color: "inherit",
                  }}
                  width={92}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" noWrap>
                        {el.score} {t("commun.pointsabbreviation")} (
                        {el.scoreavg.toFixed(1)})
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {(el.time / 1000).toFixed(2)}s
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
                </TableCell>
              ),
              rank: el.ranking,
            };
          });
          setCount(count);
          setTotal(total);
          setAvg(avg);
          setData(newdata);
          setLoading(false);
        });
      } else if (query.typeperdate === ClassementChallengeTimeEnum.alltime) {
        selectChallengeAllTimePaginate(
          query.search,
          query.sort.value,
          query.sort.ascending,
          query.page,
          query.rowsPerPage,
          query.friends,
          query.multicompte,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingAllTime> = data.data;
          const count: number = data.count;
          const total: number = data.total;
          const avg: ChallengeAvg = data.avg;
          const newdata = values.map((el) => {
            return {
              profile: el.profile,
              value: (
                <TableCell
                  sx={{
                    p: px(4),
                    color: "inherit",
                  }}
                  width={100}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" noWrap>
                        {el.score} {t("commun.pointsabbreviation")} (
                        {el.scoreavg.toFixed(1)})
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {(el.time / 1000).toFixed(2)}s
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
                </TableCell>
              ),
              rank: el.ranking,
            };
          });
          setCount(count);
          setTotal(total);
          setAvg(avg);
          setData(newdata);
          setLoading(false);
        });
      }
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [query, t, language, hasPlayChallenge]);

  const value: RankingHookData = useMemo(
    () => ({
      query,
      setQuery,
      count,
      loading,
      avg,
      total,
      data,
      sorts,
    }),
    [avg, count, data, loading, query, sorts, total],
  );

  return value;
};

export interface RankingHookData {
  query: QueryPerDate;
  setQuery: Dispatch<SetStateAction<QueryPerDate>>;
  count: number | null;
  loading: boolean;
  avg: ChallengeAvg | null;
  total: number | null;
  data: Array<DataRankingChallenge>;
  sorts: Array<{
    value: string;
    label: string;
    sort: () => void;
  }>;
}

export interface QueryGlobal extends Query {
  typeglobal: ClassementChallengeGlobalTimeEnum;
}
