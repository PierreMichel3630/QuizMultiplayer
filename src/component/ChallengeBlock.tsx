import { Box, Grid, Paper, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import {
  selectChallengeAllTimeByProfile,
  selectChallengeDayByProfileId,
  selectChallengeMonthByProfileId,
  selectChallengeWeekByProfileId,
} from "src/api/challenge";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import {
  ChallengeAvg,
  ChallengeRankingAllTime,
  ChallengeRankingDate,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import moment, { Moment } from "moment";
import { Profile } from "src/models/Profile";
import { Rank } from "./ranking/Rank";
import { RankingAverage } from "./ranking/RankingAverage";

interface PropsBase {
  profile: Profile | null;
}

interface PropsResultDayChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultDayChallengeBlock = ({
  date,
  profile,
}: PropsResultDayChallengeBlock) => {
  const [stat, setStat] = useState<null | ChallengeRankingDay>(null);

  useEffect(() => {
    const valueDate = date ?? moment();
    const getGame = () => {
      if (profile) {
        selectChallengeDayByProfileId(
          valueDate.format("YYYY-MM-DD"),
          profile.id,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingDay> = data.data;
          setStat(values[0] ?? null);
        });
      }
    };
    getGame();
  }, [date, profile]);

  return <ResultChallengeBlock stat={stat} />;
};

interface PropsResultWeekChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultWeekChallengeBlock = ({
  date,
  profile
}: PropsResultWeekChallengeBlock) => {
  const [stat, setStat] = useState<null | ChallengeRankingWeek>(null);

  useEffect(() => {
    const getStat = () => {
      if (profile && date) {
        selectChallengeWeekByProfileId(date.format("WW/YYYY"), profile.id).then(
          ({ data }) => {
            const values: Array<ChallengeRankingWeek> = data.data;
            setStat(values[0] ?? null);
          },
        );
      }
    };
    getStat();
  }, [date, profile]);

  return <ResultChallengeBlock stat={stat} />;
};

interface PropsResultMonthChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultMonthChallengeBlock = ({
  date,
  profile
}: PropsResultMonthChallengeBlock) => {
  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);

  useEffect(() => {
    const getStat = () => {
      if (profile && date) {
        selectChallengeMonthByProfileId(
          date.format("MM/YYYY"),
          profile.id,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingMonth> = data.data;
          setStat(values[0] ?? null);
        });
      }
    };
    getStat();
  }, [profile, date]);

  return <ResultChallengeBlock stat={stat} />;
};

export const ResultAllTimeChallengeBlock = ({
  profile
}: PropsBase) => {
  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        selectChallengeAllTimeByProfile(profile.id).then(({ data }) => {
          const values: Array<ChallengeRankingAllTime> = data.data;
          setStat(values[0] ?? null);
        });
      }
    };
    getStat();
  }, [profile]);

  return <ResultChallengeBlock stat={stat} />;
};

interface PropsResultChallengeBlock {
  stat: ChallengeRankingDate | null;
}
const ResultChallengeBlock = ({
  stat,
}: PropsResultChallengeBlock) => {
  const numberQuestion = useMemo(
    () => NUMBER_QUESTIONS_CHALLENGE * (stat?.games ?? 1),
    [stat],
  );

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-around"
    >
      {stat !== null  && (
        <Grid size={12}>
          <Paper
            sx={{
              p: padding(5, 15),
            }}
            elevation={8}
          >
            <Grid
              container
              columnSpacing={3}
              rowSpacing={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid>
                <Rank value={stat.ranking} />
              </Grid>
              <Grid>
                <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
                  <QuestionMarkIcon fontSize="small" />
                  <Typography variant="h6" noWrap>
                    {stat.score} / {numberQuestion}
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="h6" noWrap>
                    {(stat.time / 1000).toFixed(2)}s
                  </Typography>
                </Box>
              </Grid>
              {!!stat?.games && (
                <Grid>
                  <Box
                    sx={{ display: "flex", gap: px(2), alignItems: "center" }}
                  >
                    <SportsEsportsIcon fontSize="small" />
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{ textAlign: "center" }}
                    >
                      <Trans
                        i18nKey={"commun.game"}
                        values={{
                          count: stat.games,
                          formattedCount: stat.games,
                        }}
                        components={{ bold: <strong /> }}
                      />
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

interface PropsRecapAvgChallenge {
  avg: ChallengeAvg;
  count: number;
}

export const RecapAvgChallenge = ({ avg, count }: PropsRecapAvgChallenge) => {
  return (
    <RankingAverage
      value={avg.score}
      count={count}
      extra={
        <>
          <Typography variant="body1" component="span">
            {` - `}
          </Typography>
          <Typography variant="h6" component="span">
            {`${(avg.time / 1000).toFixed(2)}s`}
          </Typography>
        </>
      }
    />
  );
};

// TABLE

interface CellRankingChallengeDayProps {
  value: { score: number; time: number };
}
export const CellRankingChallengeDay = ({
  value,
}: CellRankingChallengeDayProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
        width: px(60),
      }}
    >
      <Typography variant="h6" noWrap>
        {value.score} / {NUMBER_QUESTIONS_CHALLENGE}
      </Typography>
      <Typography variant="h6" noWrap>
        {(value.time / 1000).toFixed(2)}s
      </Typography>
    </Box>
  );
};
