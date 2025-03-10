import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Grid,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  countChallengeGameByDate,
  selectChallengeByDate,
  selectRankingChallengeByChallengeIdPaginate,
} from "src/api/challenge";
import { Challenge, ChallengeRanking } from "src/models/Challenge";
import { ResultChallengeBlock } from "./ChallengeBlock";
import { BasicSearchInput } from "./Input";
import { RankingChallengeTable } from "./table/RankingChallengeTable";

interface Props {
  hasPlayChallenge?: boolean;
}

export const RankingChallenge = ({ hasPlayChallenge = false }: Props) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [total, setTotal] = useState<null | number>(null);
  const [date, setDate] = useState<Moment>(moment());
  const [isDisabledNextDay, setIsDisabledNextDay] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeGames, setChallengeGames] = useState<Array<ChallengeRanking>>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getChallenge = () => {
      selectChallengeByDate(date).then(({ data }) => {
        setChallenge(data);
      });
    };
    const getTotal = () => {
      countChallengeGameByDate(date).then(({ count }) => {
        setTotal(count);
      });
    };
    getChallenge();
    getTotal();
    const today = moment().startOf("day");
    setIsDisabledNextDay(today.isBefore(date));
  }, [date]);

  useEffect(() => {}, [date]);

  useEffect(() => {
    const getChallengeGames = () => {
      if (challenge) {
        selectRankingChallengeByChallengeIdPaginate(
          challenge.id,
          search,
          page,
          rowsPerPage
        ).then(({ data }) => {
          setChallengeGames(data ?? []);
          setLoading(false);
        });
      } else {
        setChallengeGames([]);
        setLoading(false);
      }
    };
    const timeout = setTimeout(getChallengeGames, 200);
    return () => clearTimeout(timeout);
  }, [challenge, search, page, rowsPerPage]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={() => setDate((prev) => moment(prev).subtract(1, "day"))}
          >
            <KeyboardArrowLeftIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4">{date.format("DD/MM/YYYY")}</Typography>
          <IconButton
            onClick={() => setDate((prev) => moment(prev).add(1, "day"))}
            disabled={isDisabledNextDay}
          >
            <KeyboardArrowRightIcon fontSize="large" />
          </IconButton>
        </Box>
      </Grid>
      <Grid item>
        <ResultChallengeBlock date={date} />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <BasicSearchInput
          label={t("commun.searchplayer")}
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      <Grid item xs={12}>
        <RankingChallengeTable
          data={challengeGames}
          loading={loading}
          hasPlayChallenge={hasPlayChallenge}
        />
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
          />
        )}
      </Grid>
    </Grid>
  );
};
