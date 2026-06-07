import { TableCell, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  selectScoreByProfileAndThemePaginate,
  selectScorePaginate,
} from "src/api/score";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { Page } from "src/models/Paginate";
import { ScoreAvg, ScoreRanking } from "src/models/Score";
import { DataRankingChallenge } from "../table/RankingChallengeTable";
import { RankingGame, Type } from "./RankGame";

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
  itemPerPage?: number;
   themes?: Array<number>;
}

export const RankingDuel = ({ itemPerPage = 10, themes }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { profile } = useAuth();

  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: itemPerPage,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: "rank", ascending: false },
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
      if (themes?.length === 1 && profile) {
        selectScoreByProfileAndThemePaginate(profile.id, themes[0], "rank").then(
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
  }, [themes, profile]);

  const sorts = useMemo(
    () => [
      {
        value: "rank",
        label: t("sort.rank"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "rank", ascending: false },
          })),
      },
      {
        value: "duelgames",
        label: t("sort.games"),
        sort: () =>
          setQuery((prev) => ({
            ...prev,
            sort: { value: "duelgames", ascending: false },
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
          theme: el.theme,
          value: (
            <TableCell
              sx={{
                p: px(4),
                color: "inherit",
                textAlign: "center",
              }}
              width={85}
            >
              <Typography variant="h4" noWrap>
                {el.rank}
              </Typography>
              <Typography noWrap>
                <Trans
                  i18nKey={"commun.game"}
                  values={{
                    count: el.duelgames,
                    formattedCount: el.duelgames,
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
      type={Type.duel}
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
