import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Grid,
  Switch,
  TableCell,
  TablePagination,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import {
  countStatAccomplishment,
  selectStatAccomplishment,
} from "src/api/accomplishment";
import {
  countChallengeGameByDate,
  countRankingChallengeAllTime,
  countRankingChallengeByMonth,
  countRankingChallengeByWeek,
  selectAvgChallengeByAllTime,
  selectAvgChallengeByDate,
  selectAvgChallengeByMonth,
  selectAvgChallengeByWeek,
  selectRankingChallengeAllTimePaginate,
  selectRankingChallengeByDatePaginate,
  selectRankingChallengeByMonthPaginate,
  selectRankingChallengeByWeekPaginate,
} from "src/api/challenge";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import {
  ChallengeAvg,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import {
  ClassementChallengeEnum,
  ClassementChallengeGlobalTimeEnum,
  ClassementChallengeTimeEnum,
} from "src/models/enum/ClassementEnum";
import { FRIENDSTATUS } from "src/models/Friend";
import {
  GroupButtonChallenge,
  GroupButtonChallengeGlobal,
  GroupButtonChallengeTime,
} from "./button/ButtonGroup";
import { WinBlock } from "./challenge/WinBlock";
import {
  ResultAllTimeChallengeBlock,
  ResultDayChallengeBlock,
  ResultMonthChallengeBlock,
  ResultWeekChallengeBlock,
} from "./ChallengeBlock";
import { ChangeDateBlock } from "./date/ChangeDateBlock";
import { BasicSearchInput } from "./Input";
import { SortButton } from "./SortBlock";
import {
  DataRankingChallenge,
  RankingChallengeTable,
} from "./table/RankingChallengeTable";
import { DateFormat } from "src/models/enum/DateEnum";

interface Props {
  hasPlayChallenge?: boolean;
}

export const RankingChallenge = ({ hasPlayChallenge = false }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();
  const { language } = useUser();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [total, setTotal] = useState<null | number>(null);
  const [date, setDate] = useState<Moment>(moment());
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ value: "ranking", ascending: true });
  const [isOnlyFriend, setIsOnlyFriend] = useState(false);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState(ClassementChallengeEnum.perdate);
  const [tabChallengeMode, setTabChallengeMode] = useState(
    ClassementChallengeGlobalTimeEnum.windaychallenge
  );
  const [tabTime, setTabTime] = useState(
    searchParams.has("time")
      ? (searchParams.get("time") as ClassementChallengeTimeEnum)
      : ClassementChallengeTimeEnum.day
  );

  const idFriends = useMemo(
    () =>
      profile && isOnlyFriend
        ? [
            profile.id,
            ...friends
              .filter((el) => el.status === FRIENDSTATUS.VALID)
              .reduce(
                (acc, value) =>
                  value.user2.id === profile.id
                    ? [...acc, value.user1.id]
                    : [...acc, value.user2.id],
                [] as Array<string>
              ),
          ]
        : undefined,
    [friends, profile, isOnlyFriend]
  );

  const sorts = useMemo(
    () =>
      tabTime === ClassementChallengeTimeEnum.day
        ? [
            {
              value: "ranking",
              label: t("sort.ranking"),
              sort: () => setSort({ value: "ranking", ascending: true }),
            },
            {
              value: "time",
              label: t("sort.time"),
              sort: () => setSort({ value: "time", ascending: true }),
            },
          ]
        : [
            {
              value: "ranking",
              label: t("sort.ranking"),
              sort: () => setSort({ value: "ranking", ascending: true }),
            },
            {
              value: "time",
              label: t("sort.time"),
              sort: () => setSort({ value: "time", ascending: true }),
            },
            {
              value: "pointsavg",
              label: t("sort.pointsavg"),
              sort: () => setSort({ value: "scoreavg", ascending: false }),
            },
            {
              value: "games",
              label: t("sort.games"),
              sort: () => setSort({ value: "games", ascending: false }),
            },
          ],
    [t, tabTime]
  );

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getTotal = () => {
      if (tab === ClassementChallengeEnum.perdate) {
        if (tabTime === ClassementChallengeTimeEnum.day) {
          countChallengeGameByDate(date, idFriends, search).then(
            ({ count }) => {
              setTotal(count);
            }
          );
        } else if (tabTime === ClassementChallengeTimeEnum.month) {
          countRankingChallengeByMonth(
            date.format("MM/YYYY"),
            search,
            idFriends
          ).then(({ count }) => {
            setTotal(count);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.week) {
          countRankingChallengeByWeek(
            date.format("WW/YYYY"),
            search,
            idFriends
          ).then(({ count }) => {
            setTotal(count);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.alltime) {
          countRankingChallengeAllTime(search, idFriends).then(({ count }) => {
            setTotal(count);
          });
        }
      } else {
        countStatAccomplishment(tabChallengeMode, search, idFriends).then(
          ({ count }) => {
            setTotal(count);
          }
        );
      }
    };
    getTotal();
  }, [date, tabTime, tabChallengeMode, search, idFriends, tab]);

  useEffect(() => {
    const getAvg = () => {
      if (tab === ClassementChallengeEnum.perdate) {
        if (tabTime === ClassementChallengeTimeEnum.day) {
          selectAvgChallengeByDate(date).then(({ data }) => {
            setAvg(data);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.week) {
          selectAvgChallengeByWeek(date).then(({ data }) => {
            setAvg(data);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.month) {
          selectAvgChallengeByMonth(date).then(({ data }) => {
            setAvg(data);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.alltime) {
          selectAvgChallengeByAllTime().then(({ data }) => {
            setAvg(data);
          });
        }
      } else {
        setAvg(null);
      }
    };
    getAvg();
  }, [tab, tabTime, date]);

  useEffect(() => {
    const getRanking = () => {
      if (tab === ClassementChallengeEnum.perdate) {
        if (tabTime === ClassementChallengeTimeEnum.day) {
          if (language) {
            selectRankingChallengeByDatePaginate(
              date,
              search,
              page,
              rowsPerPage,
              sort.value,
              sort.ascending,
              idFriends
            ).then(({ data }) => {
              const res: Array<any> = data ?? [];
              const newdata = res.map((el) => {
                return {
                  profile: el.profile,
                  value: (
                    <TableCell
                      sx={{
                        p: px(4),
                        color: "inherit",
                      }}
                      width={70}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "center",
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
                    </TableCell>
                  ),
                  rank: el.ranking,
                  uuid: el.uuid,
                };
              });
              setData(newdata);
              setLoading(false);
            });
          }
        } else if (tabTime === ClassementChallengeTimeEnum.month) {
          selectRankingChallengeByMonthPaginate(
            date.format("MM/YYYY"),
            search,
            page,
            rowsPerPage,
            sort.value,
            sort.ascending,
            idFriends
          ).then(({ data }) => {
            const res = (data ?? []) as Array<ChallengeRankingMonth>;
            const newdata = res.map((el) => {
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
            setData(newdata);
            setLoading(false);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.week) {
          selectRankingChallengeByWeekPaginate(
            date.format("WW/YYYY"),
            search,
            page,
            rowsPerPage,
            sort.value,
            sort.ascending,
            idFriends
          ).then(({ data }) => {
            const res = (data ?? []) as Array<ChallengeRankingWeek>;
            const newdata = res.map((el) => {
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
            setData(newdata);
            setLoading(false);
          });
        } else if (tabTime === ClassementChallengeTimeEnum.alltime) {
          selectRankingChallengeAllTimePaginate(
            search,
            page,
            rowsPerPage,
            sort.value,
            sort.ascending,
            idFriends
          ).then(({ data }) => {
            const res = (data ?? []) as Array<ChallengeRankingAllTime>;
            const newdata = res.map((el) => {
              return {
                profile: el.profile,
                value: (
                  <TableCell
                    sx={{
                      p: px(4),
                      color: "inherit",
                    }}
                    width={95}
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
            setData(newdata);
            setLoading(false);
          });
        }
      } else {
        selectStatAccomplishment(
          tabChallengeMode,
          page,
          rowsPerPage,
          idFriends,
          search
        ).then(({ data }) => {
          const res = data as Array<StatAccomplishment>;
          const newdata = res.map((el, index) => {
            const champ = el[tabChallengeMode];
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
              rank: page * rowsPerPage + index + 1,
            };
          });
          setData(newdata);
          setLoading(false);
        });
      }
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [
    search,
    page,
    rowsPerPage,
    date,
    tabTime,
    t,
    sort,
    idFriends,
    language,
    tab,
    tabChallengeMode,
  ]);

  const dateDisplay = useMemo(() => {
    let result = undefined;
    if (tabTime === ClassementChallengeTimeEnum.day) {
      result = date.format("DD/MM/YYYY");
    } else if (tabTime === ClassementChallengeTimeEnum.month) {
      result = date.format("MM/YYYY");
    } else if (tabTime === ClassementChallengeTimeEnum.week) {
      const start = date.clone().weekday(1);
      const end = date.clone().weekday(7);
      result = `${start.format("DD MMM")} - ${end.format("DD MMM YYYY")}`;
    }
    return result;
  }, [date, tabTime]);

  const dataDisplay = useMemo(() => {
    return [...data].map((el) => ({
      ...el,
      extra:
        tabTime === ClassementChallengeTimeEnum.day ? (
          <>
            {(hasPlayChallenge || date.diff(moment(), "day") < 0) && (
              <TableCell sx={{ p: px(4), color: "inherit" }} width={40}>
                <Link
                  to={`/challenge/game/${el.uuid}`}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </Link>
              </TableCell>
            )}
          </>
        ) : (
          <TableCell sx={{ p: px(4), color: "inherit" }} width={40}>
            <Link
              to={`/challenge/profil/${el.profile.id}`}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <VisibilityIcon fontSize="small" />
            </Link>
          </TableCell>
        ),
    }));
  }, [data, hasPlayChallenge, tabTime, date]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <GroupButtonChallenge
          selected={tab}
          onChange={(value) => {
            if (value === ClassementChallengeEnum.global) {
              setSort({
                value: ClassementChallengeGlobalTimeEnum.windaychallenge,
                ascending: true,
              });
              setTabChallengeMode(
                ClassementChallengeGlobalTimeEnum.windaychallenge
              );
            } else {
              setSort({ value: "ranking", ascending: true });
              setTabTime(ClassementChallengeTimeEnum.day);
            }
            setTab(value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {tab === ClassementChallengeEnum.global ? (
          <GroupButtonChallengeGlobal
            selected={tabChallengeMode}
            onChange={(value) => {
              setSort({ value: value, ascending: true });
              setDate(moment());
              setTabChallengeMode(value);
              setPage(0);
            }}
          />
        ) : (
          <GroupButtonChallengeTime
            selected={tabTime}
            onChange={(value) => {
              if (value === ClassementChallengeTimeEnum.day) {
                setSort({ value: "ranking", ascending: true });
              }
              setDate(moment());
              setTabTime(value);
              setPage(0);
            }}
          />
        )}
      </Grid>
      {tab === ClassementChallengeEnum.perdate && (
        <>
          {dateDisplay && (
            <ChangeDateBlock
              date={date}
              format={tabTime as unknown as DateFormat}
              onChange={(value) => setDate(value)}
            />
          )}
          <Grid item>
            {
              {
                day: (
                  <ResultDayChallengeBlock
                    date={date}
                    profile={profile}
                    avg={avg}
                  />
                ),
                week: (
                  <ResultWeekChallengeBlock
                    date={date}
                    profile={profile}
                    avg={avg}
                  />
                ),
                month: (
                  <ResultMonthChallengeBlock
                    date={date}
                    profile={profile}
                    avg={avg}
                  />
                ),
                alltime: (
                  <ResultAllTimeChallengeBlock profile={profile} avg={avg} />
                ),
              }[tabTime]
            }
          </Grid>
        </>
      )}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
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
            onChange={(value) => setSearch(value)}
            value={search}
            clear={() => setSearch("")}
          />
          {tab === ClassementChallengeEnum.perdate && (
            <SortButton menus={sorts} />
          )}
        </Box>
        {profile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              width: percent(100),
            }}
          >
            <Switch
              color="secondary"
              checked={isOnlyFriend}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPage(0);
                setIsOnlyFriend(event.target.checked);
              }}
            />
            <Typography variant="body1">{t("commun.onlyfriend")}</Typography>
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        <RankingChallengeTable data={dataDisplay} loading={loading} />
        {total !== null && total > 0 && (
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} ${t("commun.to")} ${count}`
            }
            labelRowsPerPage={""}
            showFirstButton
            showLastButton
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        )}
      </Grid>
    </Grid>
  );
};
