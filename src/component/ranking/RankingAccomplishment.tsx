import { TableCell, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { percent, px } from "csx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectStatAccomplishmentPaginate } from "src/api/accomplishment";
import { selectProfilePaginate } from "src/api/profile";
import { selectScorePaginate } from "src/api/score";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { BadgeLevel } from "src/icons/BadgeLevel";
import { StatAccomplishmentWithRanking } from "src/models/Accomplishment";
import { AccomplishmentEnum } from "src/models/enum/ClassementEnum";
import { FRIENDSTATUS } from "src/models/Friend";
import { Page } from "src/models/Paginate";
import { ScoreAvg, ScoreRanking } from "src/models/Score";
import { getLevel } from "src/utils/calcul";
import { BasicSearchInput } from "../Input";
import { RecapProfileGameDialog } from "../modal/RecapGameDialog";
import { MoneyArrondieBlock } from "../MoneyBlock";
import { Pagination } from "../page/Pagination";
import { SortButton } from "../SortBlock";
import { StreakBlock } from "../StreakBlock";
import { OnlyFriendSwitch } from "../switch/OnlyFriendSwitch";
import {
  DataRankingChallenge,
  RankingChallengeTable,
} from "../table/RankingChallengeTable";
import { RecapProfileAccomplishmentDialog } from "../modal/RecapProfileAccomplishmentDialog";
import { ProfileWithRanking } from "src/models/Profile";
import { RecapProfileDialog } from "../modal/RecapProfileDialog";

interface Sort {
  value: AccomplishmentEnum;
  ascending: boolean;
}

interface Query {
  page: number;
  rowsPerPage: number;
  search: string;
  isOnlyFriend: boolean;
  friends?: Array<string>;
  sort: Sort;
}

interface Props {
  defaultSort: AccomplishmentEnum;
  sorts?: Array<AccomplishmentEnum>;
}

enum TypeModal {
  profile = "profile",
  theme = "theme",
  accomplishment = "accomplishment",
}

export const RankingAccomplishment = ({ defaultSort, sorts = [] }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();
  const { language } = useUser();

  const ROWS_PER_PAGE = 10;

  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: ROWS_PER_PAGE,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: defaultSort, ascending: false },
  });
  const [count, setCount] = useState<null | number>(null);
  const [data, setData] = useState<Array<DataRankingChallenge>>([]);
  const [loading, setLoading] = useState(true);
  const [dataModal, setDataModal] = useState<DataRankingChallenge | undefined>(
    undefined,
  );
  const [typeModal, setTypeModal] = useState<TypeModal>(TypeModal.theme);

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

  const sortsDisplay = useMemo(
    () =>
      sorts.map((sort) => ({
        value: sort,
        label: t(`sort.${sort}`),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            page: 0,
            sort: { value: sort, ascending: false },
          })),
      })),
    [sorts, t],
  );

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      sort: { value: defaultSort, ascending: false },
    }));
  }, [defaultSort]);

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

  const renderValue = useCallback(
    (field: string, value: number) => {
      let content: JSX.Element | undefined = undefined;
      let size = 60;
      switch (field) {
        case "xp":
          content = (
            <BadgeLevel level={getLevel(value)} size={35} fontSize={15} />
          );
          size = 45;
          break;

        case "streak":
          content = <StreakBlock value={value} />;
          size = 80;
          break;

        case "money":
          content = <MoneyArrondieBlock money={value} language={language} />;
          size = 90;
          break;

        default:
          content = (
            <Typography variant="h2" noWrap>
              {value}
            </Typography>
          );
          break;
      }
      return (
        <TableCell
          sx={{
            p: px(4),
            color: "inherit",
          }}
          width={size}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            {content}
          </Box>
        </TableCell>
      );
    },
    [language],
  );

  useEffect(() => {
    const getRanking = () => {
      setData([]);
      setLoading(true);
      if (
        [AccomplishmentEnum.rank, AccomplishmentEnum.points].includes(
          query.sort.value,
        )
      ) {
        selectScorePaginate(
          query.search,
          query.page,
          query.rowsPerPage,
          query.sort.value,
          query.sort.ascending,
          query.friends,
        ).then(({ data }) => {
          const result = data as Page<ScoreRanking, ScoreAvg>;
          const values: Array<ScoreRanking> = result.data;
          const count: number = result.count;
          const newdata = values.map((el) => {
            const champ = Number(el[query.sort.value as keyof ScoreRanking]);
            return {
              profile: el.profile,
              data: el,
              rank: el.ranking,
              theme: el.theme,
              value: renderValue(query.sort.value, champ),
            };
          });
          setTypeModal(TypeModal.theme);
          setCount(count);
          setData(newdata);
          setLoading(false);
        });
      } else if (
        [AccomplishmentEnum.money, AccomplishmentEnum.streak].includes(
          query.sort.value,
        )
      ) {
        selectProfilePaginate(
          query.search,
          query.page,
          query.rowsPerPage,
          query.sort.value,
          query.sort.ascending,
          query.friends,
        ).then(({ data }) => {
          const result = data as Page<ProfileWithRanking, ScoreAvg>;
          const values: Array<ProfileWithRanking> = result.data;
          const count: number = result.count;
          const newdata = values.map((el) => {
            const champ = Number(
              el[query.sort.value as keyof ProfileWithRanking],
            );
            return {
              profile: el.profile,
              data: el,
              rank: el.ranking,
              value: renderValue(query.sort.value, champ),
            };
          });
          setTypeModal(TypeModal.profile);
          setCount(count);
          setData(newdata);
          setLoading(false);
        });
      } else {
        selectStatAccomplishmentPaginate(
          query.search,
          query.sort.value,
          query.sort.ascending,
          query.page,
          query.rowsPerPage,
          query.friends,
        ).then(({ data }) => {
          const res = data.data as Array<StatAccomplishmentWithRanking>;
          const count = data.count;
          const newdata = res.map((el) => {
            let champ = 0;
            if (
              [
                AccomplishmentEnum.themetenpts,
                AccomplishmentEnum.themetwentypts,
              ].includes(query.sort.value)
            ) {
              champ = (
                el[
                  query.sort.value as keyof StatAccomplishmentWithRanking
                ] as Array<number>
              ).length;
            } else {
              champ = Number(
                el[query.sort.value as keyof StatAccomplishmentWithRanking],
              );
            }
            return {
              profile: el.profile,
              value: renderValue(query.sort.value, champ),
              rank: el.ranking,
              data: el,
            };
          });
          setTypeModal(TypeModal.accomplishment);
          setData(newdata);
          setCount(count);
          setLoading(false);
        });
      }
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [query, t, language, renderValue]);

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
          <SortButton menus={sortsDisplay} />
        </Box>
        {profile && (
          <OnlyFriendSwitch
            isOnlyFriend={query.isOnlyFriend}
            onChange={onChangeIsOnlyFriend}
          />
        )}
      </Grid>
      <Grid size={12}>
        <RankingChallengeTable
          data={data}
          loading={loading}
          onClick={setDataModal}
        />
        <Pagination
          total={count}
          page={query.page}
          handleChangePage={handleChangePage}
          rowsPerPage={query.rowsPerPage}
        />
      </Grid>
      {
        {
          profile: (
            <RecapProfileDialog
              data={dataModal?.data}
              close={() => setDataModal(undefined)}
              open={dataModal !== undefined}
            />
          ),
          accomplishment: (
            <RecapProfileAccomplishmentDialog
              data={dataModal?.data}
              close={() => setDataModal(undefined)}
              open={dataModal !== undefined}
            />
          ),
          theme: (
            <RecapProfileGameDialog
              profileId={dataModal?.profile.id}
              theme={dataModal?.theme}
              close={() => setDataModal(undefined)}
              open={dataModal !== undefined}
            />
          ),
        }[typeModal]
      }
    </Grid>
  );
};
