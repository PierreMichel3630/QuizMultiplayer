import {
  Box,
  Grid,
  TableCell,
  TablePagination,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  countGameModeScore,
  selectGameModeScorePaginate,
} from "src/api/gamemode";
import { TypeGameMode } from "src/models/enum/GameMode";
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
  asc?: boolean;
  fixed?: number;
}
export const RankingGameMode = ({
  type,
  unit,
  onClick,
  asc = true,
  fixed = 0,
}: Props) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [total, setTotal] = useState<null | number>(null);
  const [dataBdd, setDataBdd] = useState<Array<GameModeScore>>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({
    value: OrderGameModeScore.SCORE,
    ascending: asc,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexStart = useMemo(() => page * rowsPerPage + 1, [page, rowsPerPage]);

  const sorts = useMemo(
    () => [
      {
        value: OrderGameModeScore.SCORE,
        label: t("sort.points"),
        sort: () =>
          setSort({ value: OrderGameModeScore.SCORE, ascending: asc }),
      },
      {
        value: OrderGameModeScore.GAMES,
        label: t("sort.games"),
        sort: () =>
          setSort({ value: OrderGameModeScore.GAMES, ascending: false }),
      },
    ],
    [t, asc],
  );

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getTotal = () => {
      countGameModeScore(type, [], search).then(({ count }) => {
        setTotal(count);
      });
    };
    getTotal();
  }, [type, search]);

  useEffect(() => {
    const getRanking = () => {
      selectGameModeScorePaginate(
        type,
        search,
        page,
        rowsPerPage,
        sort.value,
        sort.ascending,
      ).then(({ data }) => {
        setDataBdd(data ?? []);
        setLoading(false);
      });
    };
    const timeout = setTimeout(getRanking, 200);
    return () => clearTimeout(timeout);
  }, [type, total, page, rowsPerPage, search, sort]);

  const data = useMemo(
    () =>
      [...dataBdd].map((el, index) => ({
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
        rank: index + indexStart,
        data: el,
      })),
    [dataBdd, fixed, unit, indexStart, t],
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
      </Grid>
      <Grid size={12}>
        <RankingGameModeTable data={data} loading={loading} onClick={onClick} />
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
