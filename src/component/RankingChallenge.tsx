import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Grid,
  IconButton,
  Switch,
  TableCell,
  TablePagination,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import {
  countChallengeGameByDate,
  countRankingChallengeAllTime,
  countRankingChallengeByMonth,
  countRankingChallengeByWeek,
  selectRankingChallengeAllTimePaginate,
  selectRankingChallengeByDatePaginate,
  selectRankingChallengeByMonthPaginate,
  selectRankingChallengeByWeekPaginate,
} from "src/api/challenge";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import {
  ChallengeRanking,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { ClassementChallengeTimeEnum } from "src/models/enum/ClassementEnum";
import { FRIENDSTATUS } from "src/models/Friend";
import { GroupButtonChallengeTime } from "./button/ButtonGroup";
import { WinnerTextRankingBlock } from "./challenge/WinnerChallengeBlock";
import {
  ResultAllTimeChallengeBlock,
  ResultDayChallengeBlock,
  ResultMonthChallengeBlock,
  ResultWeekChallengeBlock,
  ResultYearChallengeBlock,
} from "./ChallengeBlock";
import { BasicSearchInput } from "./Input";
import { SortButton } from "./SortBlock";
import {
  DataRankingChallenge,
  RankingChallengeTable,
} from "./table/RankingChallengeTable";

interface Props {
  hasPlayChallenge?: boolean;
}

export const RankingChallenge = ({ hasPlayChallenge = false }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [total, setTotal] = useState<null | number>(null);
  const [date, setDate] = useState<Moment>(moment());
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ value: "ranking", ascending: true });
  const [isOnlyFriend, setIsOnlyFriend] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      if (tabTime === ClassementChallengeTimeEnum.day) {
        countChallengeGameByDate(date, idFriends).then(({ count }) => {
          setTotal(count);
        });
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
    };
    getTotal();
  }, [date, tabTime, search, idFriends]);

  const isDisabledNextDay = useMemo(() => {
    const today = moment().startOf("day");
    let future = moment(date).startOf("day");
    if (tabTime === ClassementChallengeTimeEnum.day) {
      future = future.add(1, "day");
    } else if (tabTime === ClassementChallengeTimeEnum.month) {
      future = future.add(1, "month");
    } else if (tabTime === ClassementChallengeTimeEnum.week) {
      future = future.add(1, "week");
    }
    return today.diff(future) < 0;
  }, [date, tabTime]);

  useEffect(() => {
    const getRanking = () => {
      if (tabTime === ClassementChallengeTimeEnum.day) {
        selectRankingChallengeByDatePaginate(
          date,
          search,
          page,
          rowsPerPage,
          sort.value,
          sort.ascending,
          idFriends
        ).then(({ data }) => {
          const res = (data ?? []) as Array<ChallengeRanking>;
          const newdata = res.map((el) => {
            return {
              profile: el.profile,
              profileExtra: <WinnerTextRankingBlock profile={el.profile} />,
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
              profileExtra: <WinnerTextRankingBlock profile={el.profile} />,
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
              profileExtra: <WinnerTextRankingBlock profile={el.profile} />,
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
              profileExtra: <WinnerTextRankingBlock profile={el.profile} />,
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
      }
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [search, page, rowsPerPage, date, tabTime, t, sort, idFriends]);

  const diffValue = useMemo(() => {
    let result: "day" | "month" | "week" = "day";
    if (tabTime === ClassementChallengeTimeEnum.month) {
      result = "month";
    } else if (tabTime === ClassementChallengeTimeEnum.week) {
      result = "week";
    }
    return result;
  }, [tabTime]);

  const dateDisplay = useMemo(() => {
    let result = undefined;
    if (tabTime === ClassementChallengeTimeEnum.day) {
      result = date.format("DD/MM/YYYY");
    } else if (tabTime === ClassementChallengeTimeEnum.month) {
      result = date.format("MM/YYYY");
    } else if (tabTime === ClassementChallengeTimeEnum.week) {
      result = date.format("WW/YYYY");
    }
    return result;
  }, [date, tabTime]);

  const substractDate = useCallback(() => {
    setDate((prev) => moment(prev).subtract(1, diffValue));
  }, [diffValue]);

  const addDate = useCallback(() => {
    setDate((prev) => moment(prev).add(1, diffValue));
  }, [diffValue]);

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
      </Grid>
      {dateDisplay && (
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={substractDate} size="small">
              <KeyboardArrowLeftIcon fontSize="large" />
            </IconButton>
            <Typography variant="h4">{dateDisplay}</Typography>
            <IconButton
              onClick={addDate}
              disabled={isDisabledNextDay}
              size="small"
            >
              <KeyboardArrowRightIcon fontSize="large" />
            </IconButton>
          </Box>
        </Grid>
      )}
      {hasPlayChallenge && (
        <Grid item>
          {
            {
              day: <ResultDayChallengeBlock date={date} profile={profile} />,
              week: <ResultWeekChallengeBlock date={date} profile={profile} />,
              month: (
                <ResultMonthChallengeBlock date={date} profile={profile} />
              ),
              year: <ResultYearChallengeBlock date={date} profile={profile} />,
              alltime: <ResultAllTimeChallengeBlock profile={profile} />,
            }[tabTime]
          }
        </Grid>
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
          <SortButton menus={sorts} />
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
