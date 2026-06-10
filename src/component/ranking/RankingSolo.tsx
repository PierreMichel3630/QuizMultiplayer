import { Alert, Box, Grid, TableCell, Typography } from "@mui/material";
import { percent, px } from "csx";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  selectScoreByProfileAndThemePaginate,
  selectScorePaginate,
} from "src/api/score";
import { selectSoloGamePaginate } from "src/api/sologame";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { ClassementSoloTimeEnum } from "src/models/enum/ClassementEnum";
import { FRIENDSTATUS } from "src/models/Friend";
import { SoloGameAvg, SoloGameRanking } from "src/models/Game";
import { Page } from "src/models/Paginate";
import { ScoreAvg, ScoreRanking } from "src/models/Score";
import { GroupButtonTime } from "../button/ButtonGroup";
import { BasicSearchInput } from "../Input";
import { RecapProfileGameDialog } from "../modal/RecapGameDialog";
import { Pagination } from "../page/Pagination";
import { SortButton } from "../SortBlock";
import { OnlyFriendSwitch } from "../switch/OnlyFriendSwitch";
import {
  DataRankingChallenge,
  RankingChallengeTable,
} from "../table/RankingChallengeTable";
import { RankingGame, Type } from "./RankGame";
import { RankingAverage } from "./RankingAverage";

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
  dateStart?: Moment;
  dateEnd?: Moment;
}

interface PropsRankingGlobalSolo {
  themes?: Array<number>;
  itemPerPage?: number;
  hasMyScore?: boolean
}

export const RankingGlobalSolo = ({
  itemPerPage = 10,
  hasMyScore = true,
  themes,
}: PropsRankingGlobalSolo) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { profile } = useAuth();

  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: itemPerPage,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: "points", ascending: false },
    themes: themes ?? undefined,
  });
  const [count, setCount] = useState<null | number>(null);
  const [total, setTotal] = useState<null | number>(null);
  const [avg, setAvg] = useState<null | ScoreAvg>(null);
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);

  const [myScore, setMyScore] = useState<ScoreRanking | null>(null);

  useEffect(() => {
    const getMyScore = () => {
      if (themes?.length === 1 && profile && hasMyScore === true) {
        selectScoreByProfileAndThemePaginate(profile.id, themes[0]).then(
          ({ data }) => {
            const result = data?.data ?? [];
            if (result.length === 1) {
              setMyScore(result[0]);
            }
          },
        );
      }
    };
    getMyScore();
  }, [themes, profile, hasMyScore]);

  const sorts = useMemo(
    () => [
      {
        value: "points",
        label: t("sort.points"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "points", ascending: false },
          })),
      },
      {
        value: "games",
        label: t("sort.games"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "games", ascending: false },
          })),
      },
    ],
    [t],
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
        const result = data as Page<ScoreRanking, ScoreAvg>;
        const values: Array<ScoreRanking> = result.data;
        const count: number = result.count;
        const total: number = result.total;
        const avg: ScoreAvg = result.avg;
        const newdata = values.map((el) => ({
          profile: el.profile,
          data: el,
          rank: el.ranking,
          theme: themes && themes.length > 1 ?  el.theme : undefined,
          value: (
            <TableCell
              sx={{
                p: px(4),
                color: "inherit",
                textAlign: "center",
              }}
              width={80}
            >
              <Typography variant="h4" noWrap>
                {el.points}
              </Typography>
              <Typography noWrap>
                <Trans
                  i18nKey={"commun.game"}
                  values={{
                    count: el.games,
                    formattedCount: el.games,
                  }}
                  components={{ bold: <strong /> }}
                />
              </Typography>
            </TableCell>
          ),
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
  }, [query, t, language]);

  return (
    <RankingGame
      type={Type.solo}
      myScore={myScore}
      query={query}
      data={data}
      total={total}
      avg={avg}
      loading={loading}
      sorts={sorts}
      count={count}
      setQuery={setQuery}
    />
  );
};

interface Props {
  itemPerPage?: number;
}

export const RankingSolo = ({ itemPerPage = 10 }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { profile } = useAuth();
  const { friends } = useApp();

  const [tabTime, setTabTime] = useState(ClassementSoloTimeEnum.week);
  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: itemPerPage,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: "points", ascending: false },
    dateStart: moment().subtract(7, "day"),
    dateEnd: undefined,
  });
  const [count, setCount] = useState<null | number>(null);
  const [total, setTotal] = useState<null | number>(null);
  const [avg, setAvg] = useState<null | SoloGameAvg>(null);
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);
  const [dataModal, setDataModal] = useState<DataRankingChallenge | undefined>(
    undefined,
  );

  const sorts = useMemo(
    () => [
      {
        value: "points",
        label: t("sort.points"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "points", ascending: false },
          })),
      },
    ],
    [t],
  );

  useEffect(() => {
    const getRanking = () => {
      selectSoloGamePaginate(
        query.search,
        query.page,
        query.rowsPerPage,
        query.sort.value,
        query.sort.ascending,
        query.friends,
        query.themes,
        query.dateStart,
        query.dateEnd,
      ).then(({ data }) => {
        const result = data as Page<SoloGameRanking, SoloGameAvg>;
        const values: Array<SoloGameRanking> = result.data;
        const count: number = result.count;
        const total: number = result.total;
        const avg: SoloGameAvg = result.avg;
        const newdata = values.map((el) => ({
          profile: el.profile,
          data: el,
          rank: el.ranking,
          theme: el.theme,
          value: (
            <TableCell
              sx={{
                p: px(4),
                color: "inherit",
                textAlign: "center",
              }}
              width={55}
            >
              <Typography variant="h2" noWrap>
                {el.points}
              </Typography>
            </TableCell>
          ),
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
  }, [query, t, language]);

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

  const onChangeIsOnlyFriend = useCallback(
    (value: boolean) => {
      setQuery((prev) => ({
        ...prev,
        friends: value ? [...idFriends] : undefined,
        isOnlyFriend: !prev.isOnlyFriend,
        page: 0,
      }));
    },
    [idFriends, setQuery],
  );

  const hasSearch = useMemo(
    () => query.search !== "" || query.isOnlyFriend,
    [query],
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

  const onChangeTime = (value: ClassementSoloTimeEnum) => {
    setTabTime(value);
    let dateStart: Moment | undefined = undefined;
    switch (value) {
      case ClassementSoloTimeEnum.day:
        dateStart = moment().subtract(1, "day");
        break;
      case ClassementSoloTimeEnum.week:
        dateStart = moment().subtract(7, "day");
        break;

      case ClassementSoloTimeEnum.month:
        dateStart = moment().subtract(1, "month");
        break;
    }
    setQuery((prev) => ({ ...prev, dateStart }));
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <GroupButtonTime selected={tabTime} onChange={onChangeTime} />
      </Grid>
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
      {avg !== null && total !== null && (
        <Grid size={12}>
          <RankingAverage
            label="commun.game"
            value={avg.points}
            count={total}
          />
        </Grid>
      )}
      <Grid size={12}>
        {data.length === 0 && !loading ? (
          <Alert severity="warning" sx={{ width: percent(100) }}>
            {t(hasSearch ? "alert.noresultsearch" : "alert.noresultgame")}
          </Alert>
        ) : (
          <>
            <RankingChallengeTable
              data={data}
              loading={loading}
              onClick={(value) => setDataModal(value.data)}
            />
            <Pagination
              total={count}
              page={query.page}
              handleChangePage={handleChangePage}
              rowsPerPage={query.rowsPerPage}
            />
          </>
        )}
      </Grid>
      <RecapProfileGameDialog
        profileId={dataModal?.profile.id}
        theme={dataModal?.theme}
        close={() => setDataModal(undefined)}
        open={dataModal !== undefined}
      />
    </Grid>
  );
};
