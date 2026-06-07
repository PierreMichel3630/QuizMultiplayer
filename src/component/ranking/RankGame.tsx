import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { ScoreAvg, ScoreRanking } from "src/models/Score";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { CountryImageBlock } from "../CountryBlock";
import { BasicSearchInput } from "../Input";
import { RecapProfileGameDialog } from "../modal/RecapGameDialog";
import { Pagination } from "../page/Pagination";
import { SortButton } from "../SortBlock";
import { OnlyFriendSwitch } from "../switch/OnlyFriendSwitch";
import {
  DataRankingChallenge,
  RankingChallengeTable,
} from "../table/RankingChallengeTable";
import { ProfileTitleBlock } from "../title/ProfileTitle";
import { RankBadge } from "./Rank";
import { RankingAverage } from "./RankingAverage";

export enum Type {
  duel = "duel",
  solo = "solo",
}

interface Sort {
  value: string;
  label: string;
  sort: () => void;
}

interface Query {
  page: number;
  rowsPerPage: number;
  search: string;
  isOnlyFriend: boolean;
  friends?: Array<string>;
  sort: {
    value: string;
    ascending: boolean;
  };
  themes?: Array<number>;
}

interface Props {
  type: Type;
  myScore: ScoreRanking | null;
  count: number | null;
  total: number | null;
  avg: ScoreAvg | null;
  sorts: Array<Sort>;
  data: Array<DataRankingChallenge>;
  loading?: boolean;
  query: Query;
  setQuery: Dispatch<SetStateAction<Query>>;
}

export const RankingGame = ({
  type,
  myScore,
  count,
  total,
  avg,
  sorts,
  data,
  loading,
  query,
  setQuery,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();

  const [dataRanking, setDataRanking] = useState<ScoreRanking | undefined>(
    undefined,
  );

  const hasSearch = useMemo(
    () => query.search !== "" || query.isOnlyFriend,
    [query],
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
    [idFriends, setQuery],
  );

  return (
    <Grid container spacing={1} justifyContent="center">
      {myScore !== null && (
        <Grid size={12}>
          <ScoreRankingBlock
            value={myScore}
            type={type}
            onClick={() => {
              setDataRanking(myScore);
            }}
          />
        </Grid>
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
          <RecapAvgGame type={type} avg={avg} count={total} />
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
              onClick={(value) => setDataRanking(value.data)}
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
        profileId={dataRanking?.profile.id}
        theme={dataRanking?.theme}
        close={() => setDataRanking(undefined)}
        open={dataRanking !== undefined}
      />
    </Grid>
  );
};

interface PropsMyScore {
  value: {
    points: number;
    rank: number;
    games: number;
    duelgames: number;
    ranking?: number;
    profile: Profile;
  };
  type: Type;
  onClick?: () => void;
}

export const ScoreRankingBlock = ({ value, type, onClick }: PropsMyScore) => {
  const score = useMemo(
    () => (type === Type.solo ? value.points : value.rank),
    [value, type],
  );

  const games = useMemo(
    () => (type === Type.solo ? value.games : value.duelgames),
    [value, type],
  );

  const profile = useMemo(() => value.profile, [value]);

  return (
    <Paper
      sx={{
        p: padding(5, 10),
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: onClick ? "pointer" : "default",
      }}
      elevation={8}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {value.ranking && (
        <Box>
          <RankBadge value={value.ranking} />
        </Box>
      )}
      {profile && (
        <>
          <Box>
            <AvatarAccount avatar={profile.avatar.icon} size={40} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: px(4),
              flex: 1,
            }}
          >
            <>
              <Box
                sx={{
                  textDecoration: "inherit",
                  display: "flex",
                  gap: px(8),
                  alignItems: "center",
                }}
              >
                {profile.country && (
                  <CountryImageBlock country={profile.country} />
                )}
                <Typography variant="h6" noWrap>
                  {profile.username}
                </Typography>
              </Box>
              <ProfileTitleBlock titleprofile={profile.titleprofile} />
            </>
          </Box>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" noWrap>
          {score}
        </Typography>
        <Typography noWrap>
          <Trans
            i18nKey={"commun.game"}
            values={{
              count: games,
              formattedCount: games,
            }}
            components={{ bold: <strong /> }}
          />
        </Typography>
      </Box>
    </Paper>
  );
};

interface PropsRecapAvgGame {
  avg: ScoreAvg;
  count: number;
  type: Type;
}

export const RecapAvgGame = ({ type, avg, count }: PropsRecapAvgGame) => {

  const score = useMemo(
    () => (type === Type.solo ? avg.score : avg.rank),
    [avg, type],
  );

  const games = useMemo(
    () => (type === Type.solo ? avg.games : avg.duelgames),
    [avg, type],
  );

  return (
    <RankingAverage
      value={score}
      count={count}
      extra={
        <>
          <Typography variant="body1" component="span">
            {` - `}
          </Typography>
          <Typography component="span">
            <Trans
              i18nKey={"commun.game"}
              values={{
                count: games,
                formattedCount: games.toFixed(2),
              }}
              components={{ bold: <strong /> }}
            />
          </Typography>
        </>
      }
    />
  );
};
