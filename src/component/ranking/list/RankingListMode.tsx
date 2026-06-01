import { Box, Grid, TableCell, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { countListScore, selectListScorePaginate } from "src/api/list";
import { Pagination } from "src/component/page/Pagination";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { FRIENDSTATUS } from "src/models/Friend";
import { List, ListScoreWithRanking, OrderListScore } from "src/models/List";
import { BasicSearchInput } from "../../Input";
import { SortButton } from "../../SortBlock";
import { OnlyFriendSwitch } from "../../switch/OnlyFriendSwitch";
import { RankingListTable } from "./RankingListTable";

interface Props {
  list: List;
  totalList: number;
}
export const RankingListMode = ({ list, totalList }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();
  const { language } = useUser();

  const rowsPerPage = 10;

  const [search, setSearch] = useState("");
  const [total, setTotal] = useState<null | number>(null);
  const [dataBdd, setDataBdd] = useState<Array<ListScoreWithRanking>>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({
    value: OrderListScore.TIME,
    ascending: true,
  });
  const [isOnlyFriend, setIsOnlyFriend] = useState(false);

  const [page, setPage] = useState(0);

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
                [] as Array<string>,
              ),
          ]
        : undefined,
    [friends, profile, isOnlyFriend],
  );

  const sorts = useMemo(
    () => [
      {
        value: OrderListScore.TIME,
        label: t("sort.time"),
        sort: () => setSort({ value: OrderListScore.TIME, ascending: true }),
      },
      {
        value: OrderListScore.ATTEMPT,
        label: t("sort.attempts"),
        sort: () => setSort({ value: OrderListScore.ATTEMPT, ascending: true }),
      },
    ],
    [t],
  );

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    const getTotal = () => {
      countListScore(list.id, idFriends, search).then(({ count }) => {
        setTotal(count);
      });
    };
    getTotal();
  }, [idFriends, list.id, search]);

  useEffect(() => {
    const getRanking = () => {
      selectListScorePaginate(
        list.id,
        search,
        page,
        rowsPerPage,
        sort.value,
      ).then(({ data }) => {
        setDataBdd(data ?? []);
        setLoading(false);
      });
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [language, list.id, total, page, rowsPerPage, search, sort]);

  const data = useMemo(
    () =>
      [...dataBdd].map((el) => ({
        profile: el.profile,
        value: (
          <TableCell
            sx={{
              p: px(4),
              color: "inherit",
              textAlign: "center",
            }}
            width={100}
          >
            <Typography variant="h6">
              <Trans
                i18nKey={t("commun.finditem")}
                values={{
                  value: el.result,
                  total: totalList,
                }}
              />
            </Typography>
            <Typography variant="h6">
              <Trans
                i18nKey={t("commun.attempt")}
                values={{
                  count:
                    sort.value === OrderListScore.TIME
                      ? el.attempts_recordtime
                      : el.attempts_recordattempts,
                }}
              />
            </Typography>
            <Typography variant="h6">
              {(
                (sort.value === OrderListScore.TIME
                  ? el.time_recordtime
                  : el.time_recordattempts) / 1000
              ).toFixed(2)}
              s
            </Typography>
          </TableCell>
        ),
        rank:
          sort.value === OrderListScore.TIME ? el.rank_time : el.rank_attempt,
      })),
    [dataBdd, sort.value, t, totalList],
  );

  return (
    <Grid container spacing={1} justifyContent="center">
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
            onChange={(value) => setSearch(value)}
            value={search}
            clear={() => setSearch("")}
          />
          <SortButton menus={sorts} />
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={isOnlyFriend}
            onChange={(value) => {
              setPage(0);
              setIsOnlyFriend(value);
            }}
          />
        )}
      </Grid>
      <Grid size={12}>
        <RankingListTable data={data} loading={loading} />
        <Pagination
          total={total}
          page={page}
          handleChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
        />
      </Grid>
    </Grid>
  );
};
