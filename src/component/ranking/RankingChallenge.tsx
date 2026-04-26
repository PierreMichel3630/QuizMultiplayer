import { Box, Grid, TableCell, Typography } from "@mui/material";
import { percent, px } from "csx";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { selectStatAccomplishment } from "src/api/accomplishment";
import {
  selectChallengeAllTimePaginate,
  selectChallengeDayPaginate,
  selectChallengeMonthPaginate,
  selectChallengeWeekPaginate,
} from "src/api/challenge";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import {
  ChallengeRankingAllTime,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import {
  ClassementChallengeEnum,
  ClassementChallengeGlobalTimeEnum,
  ClassementChallengeTimeEnum,
} from "src/models/enum/ClassementEnum";
import { DateFormat } from "src/models/enum/DateEnum";
import { FRIENDSTATUS } from "src/models/Friend";
import {
  GroupButtonChallenge,
  GroupButtonChallengeGlobal,
  GroupButtonChallengeTime,
} from "../button/ButtonGroup";
import { WinBlock } from "../challenge/WinBlock";
import {
  CellRankingChallengeDay,
  ResultAllTimeChallengeBlock,
  ResultDayChallengeBlock,
  ResultMonthChallengeBlock,
  ResultWeekChallengeBlock,
} from "../ChallengeBlock";
import { ChangeDateBlock } from "../date/ChangeDateBlock";
import { BasicSearchInput } from "../Input";
import { Pagination } from "../page/Pagination";
import { SortButton } from "../SortBlock";
import { OnlyFriendSwitch } from "../switch/OnlyFriendSwitch";
import {
  DataRankingChallenge,
  RankingChallengeTable,
} from "../table/RankingChallengeTable";

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
  type: ClassementChallengeEnum;
  typeglobal: ClassementChallengeGlobalTimeEnum;
  typeperdate: ClassementChallengeTimeEnum;
}

export const RankingChallenge = () => {
  const { t } = useTranslation();
  const { profile, hasPlayChallenge } = useAuth();
  const { friends } = useApp();
  const { language } = useUser();
  const [searchParams] = useSearchParams();

  const ROWS_PER_PAGE = 10;

  const [query, setQuery] = useState<Query>({
    date: moment(),
    type: ClassementChallengeEnum.perdate,
    typeglobal: ClassementChallengeGlobalTimeEnum.windaychallenge,
    typeperdate: searchParams.has("time")
      ? (searchParams.get("time") as ClassementChallengeTimeEnum)
      : ClassementChallengeTimeEnum.day,
    page: 0,
    rowsPerPage: ROWS_PER_PAGE,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: "score", ascending: false },
  });
  const [total, setTotal] = useState<null | number>(null);
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);

  const idFriends = useMemo(
    () =>
      profile
        ? [
            profile.id,
            ...friends
              .filter((el) => el.status === FRIENDSTATUS.VALID)
              .reduce(
                (acc, value) =>
                  value.user2.id === profile.id
                    ? [...acc, value.user1.id]
                    : [...acc, value.user2.id],
                [] as Array<string>,
              ),
          ]
        : [],
    [friends, profile],
  );

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

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const onChangeIsOnlyFriend = useCallback(
    (value: boolean) => {
      setQuery((prev) => ({
        ...prev,
        friends: value ? [...idFriends] : undefined,
        isOnlyFriend: !prev.isOnlyFriend,
        page: 0,
      }));
    },
    [idFriends],
  );

  useEffect(() => {
    const getRanking = () => {
      if (query.type === ClassementChallengeEnum.perdate) {
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
            ).then(({ data }) => {
              const values: Array<ChallengeRankingDay> = data.data;
              const count: number = data.count;
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
              setTotal(count);
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
          ).then(({ data }) => {
            const values: Array<ChallengeRankingMonth> = data.data;
            const count: number = data.count;
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
            setTotal(count);
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
          ).then(({ data }) => {
            const values: Array<ChallengeRankingWeek> = data.data;
            const count: number = data.count;
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
            setTotal(count);
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
          ).then(({ data }) => {
            const values: Array<ChallengeRankingAllTime> = data.data;
            const count: number = data.count;
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
            setTotal(count);
            setData(newdata);
            setLoading(false);
          });
        }
      } else {
        selectStatAccomplishment(
          query.typeglobal,
          query.page,
          query.rowsPerPage,
          query.friends,
          query.search,
        ).then(({ data }) => {
          const res = data as Array<StatAccomplishment>;
          const newdata = res.map((el, index) => {
            const champ = el[query.typeglobal];
            return {
              profile: el.profile,
              value: (
                <TableCell
                  sx={{
                    p: px(4),
                    color: "inherit",
                  }}
                  width={60}
                >
                  <WinBlock value={champ} />
                </TableCell>
              ),
              rank: query.page * query.rowsPerPage + index + 1,
            };
          });
          setData(newdata);
          setLoading(false);
        });
      }
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [query, t, language, hasPlayChallenge]);

  const dateDisplay = useMemo(() => {
    let result = undefined;
    const date = query.date;
    if (query.typeperdate === ClassementChallengeTimeEnum.day) {
      result = date.format("DD/MM/YYYY");
    } else if (query.typeperdate === ClassementChallengeTimeEnum.month) {
      result = date.format("MM/YYYY");
    } else if (query.typeperdate === ClassementChallengeTimeEnum.week) {
      const start = date.clone().weekday(1);
      const end = date.clone().weekday(7);
      result = `${start.format("DD MMM")} - ${end.format("DD MMM YYYY")}`;
    }
    return result;
  }, [query]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <GroupButtonChallenge
          selected={query.type}
          onChange={(value) => {
            if (value === ClassementChallengeEnum.global) {
              setQuery((prev) => ({
                ...prev,
                type: value,
                sort: {
                  value: ClassementChallengeGlobalTimeEnum.windaychallenge,
                  ascending: true,
                },
                typeglobal: ClassementChallengeGlobalTimeEnum.windaychallenge,
              }));
            } else {
              setQuery((prev) => ({
                ...prev,
                type: value,
                sort: { value: "points", ascending: false },
                typeperdate: ClassementChallengeTimeEnum.day,
              }));
            }
          }}
        />
      </Grid>
      <Grid size={12}>
        {query.type === ClassementChallengeEnum.global ? (
          <GroupButtonChallengeGlobal
            selected={query.typeglobal}
            onChange={(value) => {
              setQuery((prev) => ({
                ...prev,
                sort: { value: value, ascending: true },
                typeglobal: value,
                page: 0,
              }));
            }}
          />
        ) : (
          <GroupButtonChallengeTime
            type={ClassementChallengeTimeEnum}
            selected={query.typeperdate}
            onChange={(value) => {
              setQuery((prev) => ({
                ...prev,
                sort:
                  value === ClassementChallengeTimeEnum.day
                    ? { value: "score", ascending: false }
                    : prev.sort,
                typeperdate: value as ClassementChallengeTimeEnum,
                page: 0,
                date: moment(),
              }));
            }}
          />
        )}
      </Grid>
      {query.type === ClassementChallengeEnum.perdate && (
        <>
          {dateDisplay && (
            <ChangeDateBlock
              date={query.date}
              format={query.typeperdate as unknown as DateFormat}
              onChange={(value) => {
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  date: value,
                }));
              }}
            />
          )}
          <Grid>
            {
              {
                day: (
                  <ResultDayChallengeBlock
                    date={query.date}
                    profile={profile}
                  />
                ),
                week: (
                  <ResultWeekChallengeBlock
                    date={query.date}
                    profile={profile}
                  />
                ),
                month: (
                  <ResultMonthChallengeBlock
                    date={query.date}
                    profile={profile}
                  />
                ),
                alltime: <ResultAllTimeChallengeBlock profile={profile} />,
              }[query.typeperdate]
            }
          </Grid>
        </>
      )}
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        size={12}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            width: percent(100),
          }}
        >
          <BasicSearchInput
            label={t("commun.searchplayer")}
            onChange={(value) => {
              setQuery((prev) => ({
                ...prev,
                search: value,
                page: 0,
              }));
            }}
            value={query.search}
            clear={() => {
              setQuery((prev) => ({
                ...prev,
                search: "",
                page: 0,
              }));
            }}
          />
          {query.type === ClassementChallengeEnum.perdate && (
            <SortButton menus={sorts} />
          )}
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={query.isOnlyFriend}
            onChange={onChangeIsOnlyFriend}
          />
        )}
      </Grid>
      <Grid size={12}>
        <RankingChallengeTable data={data} loading={loading} />
        <Pagination
          total={total}
          page={query.page}
          handleChangePage={handleChangePage}
          rowsPerPage={query.rowsPerPage}
        />
      </Grid>
    </Grid>
  );
};
