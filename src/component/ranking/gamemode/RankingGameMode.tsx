import { Box, Grid, TableCell, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { countGameModeScore, getLeaderboardGameMode } from "src/api/gamemode";
import { Pagination } from "src/component/page/Pagination";
import { OnlyFriendSwitch } from "src/component/switch/OnlyFriendSwitch";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { FRIENDSTATUS } from "src/models/Friend";
import { GameModeScore, OrderGameModeScore } from "src/models/GameMode";
import { Profile } from "src/models/Profile";
import { BasicSearchInput } from "../../Input";
import { SortButton } from "../../SortBlock";
import { RankingGameModeTable } from "./RankingGameModeTable";

export interface DataRankingListScore {
  profile: Profile;
  value: JSX.Element;
  extra?: JSX.Element;
  rank: number;
}

interface Props {
  type: TypeGameMode;
  onClick?: (data: GameModeScore) => void;
  unit?: string;
  order?: Order;
  fixed?: number;
}

interface Sort {
  value: OrderGameModeScore;
  order: Order;
}

interface Query {
  page: number;
  rowsPerPage: number;
  search: string;
  type: TypeGameMode;
  isOnlyFriend: boolean;
  friends?: Array<string>;
  sort: Sort;
}

export const RankingGameMode = ({
  type,
  unit,
  onClick,
  order = Order.ASC,
  fixed = 0,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();

  const [total, setTotal] = useState<null | number>(null);
  const [dataBdd, setDataBdd] = useState<Array<GameModeScore>>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: 10,
    search: "",
    type: type,
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: OrderGameModeScore.SCORE, order: order },
  });

  const sorts = useMemo(
    () => [
      {
        value: OrderGameModeScore.SCORE,
        label: t("sort.points"),
        sort: () =>
          onChangeSort({ value: OrderGameModeScore.SCORE, order: order }),
      },
      {
        value: OrderGameModeScore.GAMES,
        label: t("sort.games"),
        sort: () =>
          onChangeSort({ value: OrderGameModeScore.GAMES, order: Order.DESC }),
      },
    ],
    [t, order],
  );

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

  const onChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const onChangeSort = (value: Sort) => {
    setQuery((prev) => ({
      ...prev,
      sort: value,
      page: 0,
    }));
  };

  const onChangeSearch = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      search: value,
      page: 0,
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
    const getTotal = () => {
      countGameModeScore(query.type, query.friends, query.search).then(
        (res) => {
          setTotal(res.count);
        },
      );
    };
    getTotal();
  }, [query]);

  useEffect(() => {
    const getRanking = () => {
      getLeaderboardGameMode(
        query.type,
        query.search,
        query.page,
        query.rowsPerPage,
        query.sort.value,
        query.sort.order,
        query.friends,
      ).then(({ data }) => {
        setDataBdd(data ?? []);
        setLoading(false);
      });
    };
    getRanking();
  }, [query]);

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
              {el.score.toFixed(fixed)} {unit ?? ""}
            </Typography>
            <Typography variant="h6">
              {el.games} {t("commun.games")}
            </Typography>
          </TableCell>
        ),
        rank: el.rank,
        data: el,
      })),
    [dataBdd, fixed, unit, t],
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
            onChange={(value) => onChangeSearch(value)}
            value={query.search}
            clear={() => onChangeSearch("")}
          />
          <SortButton menus={sorts} />
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={query.isOnlyFriend}
            onChange={(value) => onChangeIsOnlyFriend(value)}
          />
        )}
      </Grid>
      <Grid size={12}>
        <RankingGameModeTable data={data} loading={loading} onClick={onClick} />
        <Pagination
          total={total}
          page={query.page}
          handleChangePage={onChangePage}
          rowsPerPage={query.rowsPerPage}
        />
      </Grid>
    </Grid>
  );
};
