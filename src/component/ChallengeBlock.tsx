import { Box, Grid, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
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

interface PropsBase {
  profile: Profile | null;
  avg: ChallengeAvg | null;
  total: number | null;
}

interface PropsResultDayChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultDayChallengeBlock = ({
  date,
  profile,
  avg,
  total,
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

  return <ResultChallengeBlock stat={stat} avg={avg} total={total} />;
};

interface PropsResultWeekChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultWeekChallengeBlock = ({
  date,
  profile,
  avg,
  total,
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

  return <ResultChallengeBlock stat={stat} avg={avg} total={total} />;
};

interface PropsResultMonthChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultMonthChallengeBlock = ({
  date,
  profile,
  avg,
  total,
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

  return <ResultChallengeBlock stat={stat} avg={avg} total={total} />;
};

export const ResultAllTimeChallengeBlock = ({
  profile,
  avg,
  total,
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

  return <ResultChallengeBlock stat={stat} avg={avg} total={total} />;
};

interface PropsResultChallengeBlock {
  stat: ChallengeRankingDate | null;
  avg: ChallengeAvg | null;
  total: number | null;
}
const ResultChallengeBlock = ({
  stat,
  avg,
  total,
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
      {avg !== null && total !== null && (
        <Grid size={12}>
          <RecapAvgChallenge avg={avg} count={total} />
        </Grid>
      )}

      {stat !== null && total !== null && (
        <Grid size={12}>
          <Paper
            sx={{
              p: px(5),
            }}
            elevation={8}
          >
            <Grid
              container
              columnSpacing={3}
              rowSpacing={1}
              alignItems="center"
              justifyContent="center"
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

const RecapAvgChallenge = ({ avg, count }: PropsRecapAvgChallenge) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        justifyContent: "center",
      }}
    >
      <Typography variant="h4">
        <Trans
          i18nKey={t("commun.player")}
          values={{
            count: count,
          }}
        />
      </Typography>
      <Box>
        <Typography variant="body1" component="span">
          {`( ${t("abrevation.average")} `}
        </Typography>
        <Typography variant="h6" component="span">
          {`${avg.score.toFixed(2)} - ${(avg.time / 1000).toFixed(2)}s`}
        </Typography>
        <Typography variant="body1" component="span">
          {` )`}
        </Typography>
      </Box>
    </Box>
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
