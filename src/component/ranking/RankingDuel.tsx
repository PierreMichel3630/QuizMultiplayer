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
import { DataRanking } from "../table/RankingTable";
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
  theme?: number;
}

export const RankingDuel = ({ theme }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { profile } = useAuth();

  const ROWS_PER_PAGE = 10;

  const [query, setQuery] = useState<Query>({
    page: 0,
    rowsPerPage: ROWS_PER_PAGE,
    search: "",
    isOnlyFriend: false,
    friends: undefined,
    sort: { value: "rank", ascending: false },
    themes: theme ? [theme] : undefined,
  });
  const [count, setCount] = useState<null | number>(null);
  const [total, setTotal] = useState<null | number>(null);
  const [avg, setAvg] = useState<null | ScoreAvg>(null);
  const [data, setData] = useState<Array<DataRanking>>([]);
  const [loading, setLoading] = useState(true);
  const [myScore, setMyScore] = useState<ScoreRanking | null>(null);

  useEffect(() => {
    const getMyScore = () => {
      if (theme && profile) {
        selectScoreByProfileAndThemePaginate(profile.id, theme, "rank").then(
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
  }, [theme, profile]);

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
          value: (
            <TableCell
              sx={{
                p: px(4),
                color: "inherit",
                textAlign: "center",
              }}
              width={100}
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
