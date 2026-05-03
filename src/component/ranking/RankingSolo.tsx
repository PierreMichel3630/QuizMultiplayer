import { Box, Grid } from "@mui/material";
import { percent } from "csx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectScorePaginate } from "src/api/score";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { FRIENDSTATUS } from "src/models/Friend";
import { ScoreAvg } from "src/models/Score";
import { BasicSearchInput } from "../Input";
import { Pagination } from "../page/Pagination";
import { SortButton } from "../SortBlock";
import { OnlyFriendSwitch } from "../switch/OnlyFriendSwitch";
import { DataRanking, RankingTable } from "../table/RankingTable";

interface Sort {
  value: string;
  ascending: boolean;
}

interface Query {
  page: number;
  rowsPerPage: number;
  search: string;
  isOnlyFriend: boolean;
  friends?: Array<string>;
  sort: Sort;
  themes?: Array<number>;
}

interface Props {
  theme?: number;
}

export const RankingSolo = ({ theme }: Props) => {
  const { t } = useTranslation();
  const { profile, hasPlayChallenge } = useAuth();
  const { friends } = useApp();
  const { language } = useUser();

  const ROWS_PER_PAGE = 10;

  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: ROWS_PER_PAGE,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: "points", ascending: false },
    themes: theme ? [theme] : undefined,
  });
  const [count, setCount] = useState<null | number>(null);
  const [total, setTotal] = useState<null | number>(null);
  const [avg, setAvg] = useState<null | ScoreAvg>(null);
  const [data, setData] = useState<Array<DataRanking>>([]);
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
    () => [
      {
        value: "points",
        label: t("sort.points"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "points", ascending: true },
          })),
      },
      {
        value: "games",
        label: t("sort.games"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "games", ascending: true },
          })),
      },
    ],
    [t],
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
      selectScorePaginate(
        query.search,
        query.page,
        query.rowsPerPage,
        query.sort.value,
        query.sort.ascending,
        query.friends,
        query.themes,
      ).then(({ data }) => {
        const values: Array<any> = data.data;
        const count: number = data.count;
        const total: number = data.total;
        const avg: ScoreAvg = data.avg;
        const newdata = values.map((el) => ({
          profile: el.profile,
          rank: el.ranking,
          value: el.points,
        }));
        setAvg(avg);
        setCount(count);
        setData(newdata);
        setTotal(total);
        setLoading(false);
      });
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [query, t, language, hasPlayChallenge]);

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
          <SortButton menus={sorts} />
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={query.isOnlyFriend}
            onChange={onChangeIsOnlyFriend}
          />
        )}
      </Grid>
      <Grid size={12}>
        <RankingTable data={data} loading={loading} />
        <Pagination
          total={count}
          page={query.page}
          handleChangePage={handleChangePage}
          rowsPerPage={query.rowsPerPage}
        />
      </Grid>
    </Grid>
  );
};
