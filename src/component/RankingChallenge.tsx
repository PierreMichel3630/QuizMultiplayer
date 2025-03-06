import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Grid, Typography } from "@mui/material";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  selectChallengeByDate,
  selectRankingChallengeByChallengeId,
} from "src/api/challenge";
import { Challenge, ChallengeRanking } from "src/models/Challenge";
import { BasicSearchInput } from "./Input";
import { RankingChallengeTable } from "./table/RankingChallengeTable";

export const RankingChallenge = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Moment>(moment());
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeGames, setChallengeGames] = useState<Array<ChallengeRanking>>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChallenge = () => {
      selectChallengeByDate(date).then(({ data }) => {
        setChallenge(data);
      });
    };
    getChallenge();
  }, [date]);

  useEffect(() => {
    const getChallengeGames = () => {
      if (challenge) {
        selectRankingChallengeByChallengeId(challenge.id, search).then(
          ({ data }) => {
            setChallengeGames(data ?? []);
            setLoading(false);
          }
        );
      } else {
        setChallengeGames([]);
        setLoading(false);
      }
    };
    const timeout = setTimeout(getChallengeGames, 200);
    return () => clearTimeout(timeout);
  }, [challenge, search]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2">{t("commun.ranking")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KeyboardArrowLeftIcon
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setDate((prev) => moment(prev).subtract(1, "day"))}
          />
          <Typography variant="h4">{date.format("DD/MM/YYYY")}</Typography>
          <KeyboardArrowRightIcon
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setDate((prev) => moment(prev).add(1, "day"))}
          />
        </Box>
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
        <RankingChallengeTable data={challengeGames} loading={loading} />
      </Grid>
    </Grid>
  );
};
