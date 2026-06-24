import { Alert, Box, Grid, TableCell } from "@mui/material";
import { percent, px } from "csx";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectStatAccomplishmentPaginate } from "src/api/accomplishment";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { StatAccomplishmentWithRanking } from "src/models/Accomplishment";
import {
  ClassementChallengeEnum,
  ClassementChallengeGlobalTimeEnum,
  ClassementChallengeTimeEnum,
} from "src/models/enum/ClassementEnum";
import { DateFormat } from "src/models/enum/DateEnum";
import { FRIENDSTATUS } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import {
  GroupButtonChallenge,
  GroupButtonChallengeGlobal,
  GroupButtonChallengeTime,
} from "../button/ButtonGroup";
import { ChallengeProfilDialog } from "../challenge/ChallengeProfilDialog";
import { WinBlock } from "../challenge/WinBlock";
import {
  RecapAvgChallenge,
  ResultAllTimeChallengeBlock,
  ResultDayChallengeBlock,
  ResultMonthChallengeBlock,
  ResultWeekChallengeBlock
} from "../ChallengeBlock";
import { ChangeDateBlock } from "../date/ChangeDateBlock";
import { BasicSearchInput } from "../Input";
import { Pagination } from "../page/Pagination";
import { SortButton } from "../SortBlock";
import { OnlyFriendSwitch } from "../switch/OnlyFriendSwitch";
import { DataRankingChallenge, RankingTable } from "../table/RankingTable";
import {
  QueryGlobal,
  QueryPerDate,
  RankingHookData,
  useRankingChallengePerDate,
} from "./hook/RankingHook";

export const RankingChallenge = () => {
  const [type, setType] = useState<ClassementChallengeEnum>(
    ClassementChallengeEnum.perdate,
  );

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <GroupButtonChallenge
          selected={type}
          onChange={(value) => {
            setType(value);
          }}
        />
      </Grid>
      <Grid size={12}>
        {
          {
            global: <RankingChallengeGlobal />,
            perdate: <RankingChallengePerDate />,
          }[type]
        }
      </Grid>
    </Grid>
  );
};

export const RankingChallengeGlobal = () => {
  const { t } = useTranslation();
  const { profile, hasPlayChallenge, multicompte } = useAuth();
  const { friends } = useApp();
  const { language } = useUser();

  const ROWS_PER_PAGE = 10;

  const [query, setQuery] = useState<QueryGlobal>({
    date: moment(),
    typeglobal: ClassementChallengeGlobalTimeEnum.windaychallenge,
    page: 0,
    rowsPerPage: ROWS_PER_PAGE,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    multicompte: multicompte,
    sort: { value: "score", ascending: false },
  });
  const [total, setTotal] = useState<null | number>(null);
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);
  const [dataRankingChallenge, setDataRankingChallenge] = useState<
    DataRankingChallenge | undefined
  >(undefined);

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

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      multicompte: multicompte,
    }));
  }, [multicompte]);

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
      selectStatAccomplishmentPaginate(
        query.search,
        query.typeglobal,
        false,
        query.page,
        query.rowsPerPage,
        query.friends,
        query.multicompte,
      ).then(({ data }) => {
        const res = data.data as Array<StatAccomplishmentWithRanking>;
        const total = data.total;
        const newdata = res.map((el) => {
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
            rank: el.ranking,
          };
        });
        setData(newdata);
        setLoading(false);
        setTotal(total);
      });
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [query, t, language, hasPlayChallenge]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
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
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={query.isOnlyFriend}
            onChange={onChangeIsOnlyFriend}
          />
        )}
      </Grid>
      <Grid size={12}>
        <RankingTable
          data={data}
          loading={loading}
          onClick={setDataRankingChallenge}
        />
        <Pagination
          total={total}
          page={query.page}
          handleChangePage={handleChangePage}
          rowsPerPage={query.rowsPerPage}
        />
      </Grid>
      <ChallengeProfilDialog
        profileId={dataRankingChallenge?.profile.id}
        close={() => setDataRankingChallenge(undefined)}
        open={dataRankingChallenge !== undefined}
      />
    </Grid>
  );
};

// Page Challenge
interface PropsRankingChallengePerDate {
  itemPerPage?: number;
}
const RankingChallengePerDate = ({
  itemPerPage = 10,
}: PropsRankingChallengePerDate) => {
  const ranking = useRankingChallengePerDate(itemPerPage);
  const { profile } = useAuth();

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <RankingChallengeFilters
          query={ranking.query}
          setQuery={ranking.setQuery}
        />
      </Grid>
      {profile && (
        <Grid size={12}>
          <RankingChallengeSummary profile={profile} query={ranking.query} />
        </Grid>
      )}
      <Grid size={12}>
        <BaseRankingChallenge ranking={ranking} />
      </Grid>
    </Grid>
  );
};

// Page Home
interface PropsRankingChallengeHome {
  itemPerPage?: number;
}
export const RankingChallengeHome = ({
  itemPerPage = 5,
}: PropsRankingChallengeHome) => {
  const ranking = useRankingChallengePerDate(itemPerPage);
  const { profile } = useAuth();

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <RankingChallengeFilters
          query={ranking.query}
          setQuery={ranking.setQuery}
        />
      </Grid>
      {profile && (
        <Grid size={12}>
          <RankingChallengeSummary profile={profile} query={ranking.query} />
        </Grid>
      )}
      <Grid size={12}>
        <BaseRankingChallenge ranking={ranking} />
      </Grid>
    </Grid>
  );
};

// Page de resultat du defis du jour
interface PropsRankingChallengeResult {
  itemPerPage?: number;
}
export const RankingChallengeResult = ({
  itemPerPage = 3,
}: PropsRankingChallengeResult) => {
  const ranking = useRankingChallengePerDate(itemPerPage);
  const { profile } = useAuth();

  return (
    <Grid container spacing={1}>
      {profile && (
        <Grid size={12}>
          <RankingChallengeSummary profile={profile} query={ranking.query} />
        </Grid>
      )}
      <Grid size={12}>
        <BaseRankingChallenge ranking={ranking} />
      </Grid>
    </Grid>
  );
};

interface RankingChallengeFiltersProps {
  query: QueryPerDate;
  setQuery: React.Dispatch<React.SetStateAction<QueryPerDate>>;
}

const RankingChallengeFilters = ({
  query,
  setQuery,
}: RankingChallengeFiltersProps) => {
  return (
    <>
      <Grid size={12}>
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
      </Grid>

      <ChangeDateBlock
        date={query.date}
        format={query.typeperdate as unknown as DateFormat}
        onChange={(value) =>
          setQuery((prev) => ({
            ...prev,
            page: 0,
            date: value,
          }))
        }
      />
    </>
  );
};

interface RankingChallengeSummaryProps {
  query: QueryPerDate;
  profile: Profile;
}

const RankingChallengeSummary = ({
  query,
  profile,
}: RankingChallengeSummaryProps) => {
  return (
    <Grid>
      {
        {
          day: <ResultDayChallengeBlock date={query.date} profile={profile} />,
          week: (
            <ResultWeekChallengeBlock date={query.date} profile={profile} />
          ),
          month: (
            <ResultMonthChallengeBlock date={query.date} profile={profile} />
          ),
          alltime: <ResultAllTimeChallengeBlock profile={profile} />,
        }[query.typeperdate]
      }
    </Grid>
  );
};

interface PropsBaseRankingChallenge {
  ranking: RankingHookData;
}
const BaseRankingChallenge = ({
  ranking,
}: PropsBaseRankingChallenge) => {
  const { t } = useTranslation();
  const { profile, multicompte } = useAuth();
  const { friends } = useApp();

  const [dataRankingChallenge, setDataRankingChallenge] = useState<
    DataRankingChallenge | undefined
  >(undefined);

  const hasSearch = useMemo(
    () => ranking.query.search !== "" || ranking.query.isOnlyFriend,
    [ranking.query],
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

  useEffect(() => {
    ranking.setQuery((prev) => ({
      ...prev,
      multicompte: multicompte,
    }));
  }, [multicompte]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    ranking.setQuery((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const onChangeIsOnlyFriend = useCallback(
    (value: boolean) => {
      ranking.setQuery((prev) => ({
        ...prev,
        multicompte: value ? undefined : multicompte,
        friends: value ? [...idFriends] : undefined,
        isOnlyFriend: !prev.isOnlyFriend,
        page: 0,
      }));
    },
    [idFriends, multicompte],
  );

  return (
    <Grid container spacing={1}>
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
              ranking.setQuery((prev) => ({
                ...prev,
                search: value,
                page: 0,
              }));
            }}
            value={ranking.query.search}
            clear={() => {
              ranking.setQuery((prev) => ({
                ...prev,
                search: "",
                page: 0,
              }));
            }}
          />
          <SortButton menus={ranking.sorts} />
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={ranking.query.isOnlyFriend}
            onChange={onChangeIsOnlyFriend}
          />
        )}
      </Grid>
      {ranking.avg !== null && ranking.total !== null && (
        <Grid size={12}>
          <RecapAvgChallenge avg={ranking.avg} count={ranking.total} />
        </Grid>
      )}
      <Grid size={12}>
        {ranking.data.length === 0 && !ranking.loading ? (
          <Alert severity="warning" sx={{ width: percent(100) }}>
            {t(hasSearch ? "alert.noresultsearch" : "alert.noresultgame")}
          </Alert>
        ) : (
          <>
            <RankingTable
              data={ranking.data}
              loading={ranking.loading}
              onClick={setDataRankingChallenge}
            />
            <Pagination
              total={ranking.count}
              page={ranking.query.page}
              handleChangePage={handleChangePage}
              rowsPerPage={ranking.query.rowsPerPage}
            />
          </>
        )}
      </Grid>
      <ChallengeProfilDialog
        profileId={dataRankingChallenge?.profile.id}
        close={() => setDataRankingChallenge(undefined)}
        open={dataRankingChallenge !== undefined}
      />
    </Grid>
  );
};
