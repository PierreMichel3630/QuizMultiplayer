import { Box, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  countChallengeGameByDate,
  countRankingChallengeAllTime,
  countRankingChallengeByMonth,
  countRankingChallengeByWeek,
  selectChallengeGameByDateAndProfileId,
  selectRankingChallengeAllTimeByProfileId,
  selectRankingChallengeByDateAndProfileId,
  selectRankingChallengeMonthByMonthAndProfileId,
  selectRankingChallengeWeekByWeekAndProfileId,
} from "src/api/challenge";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import {
  ChallengeAvg,
  ChallengeGame,
  ChallengeRanking,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import moment, { Moment } from "moment";
import { Profile } from "src/models/Profile";
import { PositionTypography } from "./typography/PositionTypography";

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
  title,
  avg,
}: PropsResultDayChallengeBlock) => {
  const { t } = useTranslation();

  const [game, setGame] = useState<null | ChallengeGame>(null);
  const [rank, setRank] = useState<null | ChallengeRanking>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  const isDisplay = useMemo(() => rank || avg, [avg, rank]);

  useEffect(() => {
    const valueDate = date ?? moment();
    countChallengeGameByDate(valueDate).then(({ count }) => {
      setNumberPlayers(count);
    });
  }, [date]);

  useEffect(() => {
    const valueDate = date ?? moment();
    const getGame = () => {
      if (profile) {
        selectChallengeGameByDateAndProfileId(valueDate, profile.id).then(
          ({ data }) => {
            setGame(data);
          }
        );
      }
    };
    const getRank = () => {
      if (profile) {
        selectRankingChallengeByDateAndProfileId(valueDate, profile.id).then(
          ({ data }) => {
            setRank(data);
          }
        );
      }
    };
    getGame();
    getRank();
  }, [date, profile]);

  const topPercent = useMemo(
    () =>
      rank && numberPlayers
        ? ((rank.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, rank]
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
            item
            xs={12}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            {rank && avg ? (
              <>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <PositionTypography position={rank.ranking} />
                  <Typography variant="h2" noWrap>
                    / {avg.players}
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
                      count: avg.players,
                    }}
                  />
                </Typography>
              )
            )}
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <QuestionMarkIcon />
            <Box>
              {game && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {game.score} / {NUMBER_QUESTIONS_CHALLENGE}
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
            item
            xs={6}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AccessTimeIcon />
            <Box>
              {game && (
                <Typography variant="h4" noWrap sx={{ textAlign: "center" }}>
                  {(game.time / 1000).toFixed(2)}s
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
  title,
  avg,
}: PropsResultWeekChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingWeek>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);
  const isDisplay = useMemo(() => stat || avg, [avg, stat]);

  useEffect(() => {
    const valueDate = date ?? moment();
    countRankingChallengeByWeek(valueDate.format("WW/YYYY")).then(
      ({ count }) => {
        setNumberPlayers(count);
      }
    );
  }, [date]);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        const valueDate = date ?? moment();
        selectRankingChallengeWeekByWeekAndProfileId(
          valueDate.format("WW/YYYY"),
          profile.id
        ).then(({ data }) => {
          setStat(data);
        });
      }
    };
    getStat();
  }, [date, profile]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat]
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
            item
            xs={12}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            {stat && avg ? (
              <>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <PositionTypography position={stat.ranking} />
                  <Typography variant="h2" noWrap>
                    / {avg.players}
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
                      count: avg.players,
                    }}
                  />
                </Typography>
              )
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
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
            {avg?.games && (
              <Box>
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.games.toFixed(2)})
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
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
            item
            xs={6}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
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
  title,
  avg,
}: PropsResultMonthChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingMonth>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  const isDisplay = useMemo(() => stat || avg, [avg, stat]);

  useEffect(() => {
    const valueDate = date ?? moment();
    countRankingChallengeByMonth(valueDate.format("MM/YYYY")).then(
      ({ count }) => {
        setNumberPlayers(count);
      }
    );
  }, [date]);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        const valueDate = date ?? moment();
        selectRankingChallengeMonthByMonthAndProfileId(
          valueDate.format("MM/YYYY"),
          profile.id
        ).then(({ data }) => {
          setStat(data);
        });
      }
    };
    getStat();
  }, [date, profile]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat]
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
            item
            xs={12}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            {stat && avg ? (
              <>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <PositionTypography position={stat.ranking} />
                  <Typography variant="h2" noWrap>
                    / {avg.players}
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
                      count: avg.players,
                    }}
                  />
                </Typography>
              )
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
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
            {avg?.games && (
              <Box>
                <Typography variant="body1" noWrap>
                  ({t("abrevation.average")} {avg.games.toFixed(2)})
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
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
            item
            xs={6}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
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

export const ResultAllTimeChallengeBlock = ({
  profile,
  title,
  avg,
}: PropsBase) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    countRankingChallengeAllTime().then(({ count }) => {
      setNumberPlayers(count);
    });
  }, []);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        selectRankingChallengeAllTimeByProfileId(profile.id).then(
          ({ data }) => {
            setStat(data);
          }
        );
      }
    };
    getStat();
  }, [profile]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat]
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
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "baseline",
          }}
        >
          {title && (
            <Typography variant="h4" noWrap>
              {title}
            </Typography>
          )}
          {stat && avg ? (
            <>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <PositionTypography position={stat.ranking} />
                <Typography variant="h2" noWrap>
                  / {avg.players}
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
                    count: avg.players,
                  }}
                />
              </Typography>
            )
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
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
          {avg?.games && (
            <Box>
              <Typography variant="body1" noWrap>
                ({t("abrevation.average")} {avg.games.toFixed(2)})
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
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
          item
          xs={6}
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
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
}

export const RecapAvgChallenge = ({ avg }: PropsRecapAvgChallenge) => {
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
            count: avg.players,
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
