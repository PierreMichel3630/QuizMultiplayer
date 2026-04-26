import { Box, Grid, Typography } from "@mui/material";
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
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import moment, { Moment } from "moment";
import { Profile } from "src/models/Profile";
import { Rank } from "./ranking/Rank";

interface PropsBase {
  profile: Profile | null;
  title?: string;
  avg?: ChallengeAvg | null;
}

interface PropsResultDayChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultDayChallengeBlock = ({
  date,
  profile,
}: PropsResultDayChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingDay>(null);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  const isDisplay = useMemo(() => stat || avg, [avg, stat]);

  useEffect(() => {
    const valueDate = date ?? moment();
    const getGame = () => {
      if (profile) {
        selectChallengeDayByProfileId(
          valueDate.format("YYYY-MM-DD"),
          profile.id,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingDay> = data.data;
          const avg: ChallengeAvg = data.avg;
          const total: number = data.total;
          setStat(values[0] ?? null);
          setAvg(avg);
          setNumberPlayers(total);
        });
      }
    };
    getGame();
  }, [date, profile]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat],
  );

  return (
    isDisplay && (
      <Box
        sx={{
          backgroundColor: Colors.green3,
          color: Colors.white,
          borderRadius: px(10),
          p: 1,
        }}
      >
        <Grid container spacing={1}>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "baseline",
            }}
            size={12}
          >
            {stat && numberPlayers ? (
              <>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Rank value={stat.ranking} />
                  <Typography variant="h2" noWrap>
                    / {numberPlayers}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  ({t("commun.top")} : {topPercent}%)
                </Typography>
              </>
            ) : (
              numberPlayers && (
                <Typography variant="h2">
                  <Trans
                    i18nKey={t("commun.player")}
                    values={{
                      count: numberPlayers,
                    }}
                  />
                </Typography>
              )
            )}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={6}
          >
            <QuestionMarkIcon />
            <Box>
              {stat && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {stat.score} / {NUMBER_QUESTIONS_CHALLENGE}
                </Typography>
              )}
              {avg && (
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.score.toFixed(2)}/
                  {NUMBER_QUESTIONS_CHALLENGE})
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={6}
          >
            <AccessTimeIcon />
            <Box>
              {stat && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {(stat.time / 1000).toFixed(2)}s
                </Typography>
              )}
              {avg && (
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {(avg.time / 1000).toFixed(2)}s)
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

interface PropsResultWeekChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultWeekChallengeBlock = ({
  date,
  profile,
}: PropsResultWeekChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingWeek>(null);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);
  const isDisplay = useMemo(() => stat || avg, [avg, stat]);

  useEffect(() => {
    const getStat = () => {
      if (profile && date) {
        selectChallengeWeekByProfileId(date.format("WW/YYYY"), profile.id).then(
          ({ data }) => {
            const values: Array<ChallengeRankingWeek> = data.data;
            const avg: ChallengeAvg = data.avg;
            const total: number = data.total;
            setStat(values[0] ?? null);
            setAvg(avg);
            setNumberPlayers(total);
          },
        );
      }
    };
    getStat();
  }, [date, profile]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat],
  );

  return (
    isDisplay && (
      <Box
        sx={{
          backgroundColor: Colors.green3,
          color: Colors.white,
          borderRadius: px(10),
          p: 1,
        }}
      >
        <Grid container spacing={1}>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "baseline",
            }}
            size={12}
          >
            {stat && numberPlayers ? (
              <>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Rank value={stat.ranking} />
                  <Typography variant="h2" noWrap>
                    / {numberPlayers}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  ({t("commun.top")} : {topPercent}%)
                </Typography>
              </>
            ) : (
              numberPlayers && (
                <Typography variant="h2">
                  <Trans
                    i18nKey={t("commun.player")}
                    values={{
                      count: numberPlayers,
                    }}
                  />
                </Typography>
              )
            )}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={12}
          >
            <SportsEsportsIcon />
            {stat && (
              <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                <Trans
                  i18nKey={t("commun.game")}
                  values={{
                    count: stat.games,
                  }}
                />
              </Typography>
            )}
            {avg && (
              <Box>
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.games.toFixed(2)})
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={6}
          >
            <QuestionMarkIcon />
            <Box>
              {stat && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
                </Typography>
              )}
              {avg && (
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.score.toFixed(2)})
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={6}
          >
            <AccessTimeIcon />
            <Box>
              {stat && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {(stat.time / 1000).toFixed(2)}s
                </Typography>
              )}
              {avg && (
                <Box>
                  <Typography variant="body1" noWrap>
                    ({t("abrevation.average")} {(avg.time / 1000).toFixed(2)}s)
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

interface PropsResultMonthChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultMonthChallengeBlock = ({
  date,
  profile,
}: PropsResultMonthChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    const getStat = () => {
      if (profile && date) {
        selectChallengeMonthByProfileId(
          date.format("MM/YYYY"),
          profile.id,
        ).then(({ data }) => {
          const values: Array<ChallengeRankingMonth> = data.data;
          const avg: ChallengeAvg = data.avg;
          const total: number = data.total;
          setStat(values[0] ?? null);
          setAvg(avg);
          setNumberPlayers(total);
        });
      }
    };
    getStat();
  }, [profile, date]);

  const isDisplay = useMemo(() => stat || avg, [avg, stat]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat],
  );

  return (
    isDisplay && (
      <Box
        sx={{
          backgroundColor: Colors.green3,
          color: Colors.white,
          borderRadius: px(10),
          p: 1,
        }}
      >
        <Grid container spacing={1}>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "baseline",
            }}
            size={12}
          >
            {stat && numberPlayers ? (
              <>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Rank value={stat.ranking} />
                  <Typography variant="h2" noWrap>
                    / {numberPlayers}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  ({t("commun.top")} : {topPercent}%)
                </Typography>
              </>
            ) : (
              numberPlayers && (
                <Typography variant="h2">
                  <Trans
                    i18nKey={t("commun.player")}
                    values={{
                      count: numberPlayers,
                    }}
                  />
                </Typography>
              )
            )}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={12}
          >
            <SportsEsportsIcon />
            {stat && (
              <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                <Trans
                  i18nKey={t("commun.game")}
                  values={{
                    count: stat.games,
                  }}
                />
              </Typography>
            )}
            {avg && (
              <Box>
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.games.toFixed(2)})
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={6}
          >
            <QuestionMarkIcon />
            <Box>
              {stat && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
                </Typography>
              )}
              {avg && (
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.score.toFixed(2)})
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={6}
          >
            <AccessTimeIcon />
            <Box>
              {stat && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {(stat.time / 1000).toFixed(2)}s
                </Typography>
              )}
              {avg && (
                <Box>
                  <Typography variant="body1" noWrap>
                    ({t("abrevation.average")} {(avg.time / 1000).toFixed(2)}s)
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

export const ResultAllTimeChallengeBlock = ({ profile }: PropsBase) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);
  const [avg, setAvg] = useState<null | ChallengeAvg>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        selectChallengeAllTimeByProfile(profile.id).then(({ data }) => {
          const values: Array<ChallengeRankingAllTime> = data.data;
          const avg: ChallengeAvg = data.avg;
          const count: number = data.total;
          setStat(values[0] ?? null);
          setAvg(avg);
          setNumberPlayers(count);
        });
      }
    };
    getStat();
  }, [profile]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat],
  );

  return (
    <Box
      sx={{
        backgroundColor: Colors.green3,
        color: Colors.white,
        borderRadius: px(10),
        p: 1,
      }}
    >
      <Grid container spacing={1}>
        <Grid
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "baseline",
          }}
          size={12}
        >
          {stat && numberPlayers ? (
            <>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Rank value={stat.ranking} />
                <Typography variant="h2" noWrap>
                  / {numberPlayers}
                </Typography>
              </Box>
              <Typography variant="body1">
                ({t("commun.top")} : {topPercent}%)
              </Typography>
            </>
          ) : (
            avg && (
              <Typography variant="h2">
                <Trans
                  i18nKey={t("commun.player")}
                  values={{
                    count: numberPlayers,
                  }}
                />
              </Typography>
            )
          )}
        </Grid>
        <Grid
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          size={12}
        >
          <SportsEsportsIcon />
          {stat && (
            <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
              <Trans
                i18nKey={t("commun.game")}
                values={{
                  count: stat.games,
                }}
              />
            </Typography>
          )}
          {avg && (
            <Box>
              <Typography variant="body1" noWrap>
                ({t("abrevation.average")} {avg.games.toFixed(2)})
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          size={6}
        >
          <QuestionMarkIcon />
          <Box>
            {stat && (
              <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
              </Typography>
            )}
            {avg && (
              <Typography variant="body1" noWrap>
                ({t("abrevation.average")} {avg.score.toFixed(2)})
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          size={6}
        >
          <AccessTimeIcon />
          <Box>
            {stat && (
              <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                {(stat.time / 1000).toFixed(2)}s
              </Typography>
            )}
            {avg && (
              <Box>
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {(avg.time / 1000).toFixed(2)}s)
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

interface PropsRecapAvgChallenge {
  avg: ChallengeAvg;
  count: number;
}

export const RecapAvgChallenge = ({ avg, count }: PropsRecapAvgChallenge) => {
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
