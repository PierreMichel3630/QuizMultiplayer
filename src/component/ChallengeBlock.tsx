import { Box, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  countChallengeGameByDate,
  countRankingChallengeAllTime,
  countRankingChallengeByMonth,
  countRankingChallengeByWeek,
  countRankingChallengeByYear,
  selectChallengeGameByDateAndProfileId,
  selectRankingChallengeAllTimeByProfileId,
  selectRankingChallengeByDateAndProfileId,
  selectRankingChallengeByMonthAndProfileId,
  selectRankingChallengeByWeekAndProfileId,
  selectRankingChallengeByYearAndProfileId,
} from "src/api/challenge";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { useAuth } from "src/context/AuthProviderSupabase";
import {
  ChallengeGame,
  ChallengeRanking,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

interface PropsResultDayChallengeBlock {
  date: Moment;
}

export const ResultDayChallengeBlock = ({
  date,
}: PropsResultDayChallengeBlock) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [game, setGame] = useState<null | ChallengeGame>(null);
  const [rank, setRank] = useState<null | ChallengeRanking>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    countChallengeGameByDate(date).then(({ count }) => {
      setNumberPlayers(count);
    });
  }, [date]);

  useEffect(() => {
    const getGame = () => {
      if (profile) {
        selectChallengeGameByDateAndProfileId(date, profile.id).then(
          ({ data }) => {
            setGame(data);
          }
        );
      }
    };
    const getRank = () => {
      if (profile) {
        selectRankingChallengeByDateAndProfileId(date, profile.id).then(
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
    rank &&
    game && (
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
            <Typography variant="h4" noWrap>
              {t("commun.ranking")} :
            </Typography>
            <Typography variant="h2" noWrap>
              <Trans
                i18nKey={t("commun.position")}
                values={{
                  count: rank.ranking,
                }}
                components={{ sup: <sup /> }}
              />
            </Typography>
            <Typography variant="caption">
              ({t("commun.top")} : {topPercent}%)
            </Typography>
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
            <Typography variant="h4" noWrap>
              {game.score} / {NUMBER_QUESTIONS_CHALLENGE}
            </Typography>
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
            <Typography variant="h4" noWrap>
              {(game.time / 1000).toFixed(2)}s
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

interface PropsResultWeekChallengeBlock {
  date: Moment;
}

export const ResultWeekChallengeBlock = ({
  date,
}: PropsResultWeekChallengeBlock) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [stat, setStat] = useState<null | ChallengeRankingWeek>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    countRankingChallengeByWeek(date.format("WW/YYYY")).then(({ count }) => {
      setNumberPlayers(count);
    });
  }, [date]);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        selectRankingChallengeByWeekAndProfileId(
          date.format("WW/YYYY"),
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
    stat && (
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
            <Typography variant="h4" noWrap>
              {t("commun.ranking")} :
            </Typography>
            <Typography variant="h2" noWrap>
              <Trans
                i18nKey={t("commun.position")}
                values={{
                  count: stat.ranking,
                }}
                components={{ sup: <sup /> }}
              />
            </Typography>
            <Typography variant="caption">
              ({t("commun.top")} : {topPercent}%)
            </Typography>
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
            <Typography variant="h4" noWrap>
              {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
            </Typography>
            <Typography variant="body1" noWrap>
              ({stat.scoreavg.toFixed(1)})
            </Typography>
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
            <Typography variant="h4" noWrap>
              {(stat.time / 1000).toFixed(2)}s
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

interface PropsResultMonthChallengeBlock {
  date: Moment;
}

export const ResultMonthChallengeBlock = ({
  date,
}: PropsResultMonthChallengeBlock) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [stat, setStat] = useState<null | ChallengeRankingMonth>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    countRankingChallengeByMonth(date.format("MM/YYYY")).then(({ count }) => {
      setNumberPlayers(count);
    });
  }, [date]);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        selectRankingChallengeByMonthAndProfileId(
          date.format("MM/YYYY"),
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
    stat && (
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
            <Typography variant="h4" noWrap>
              {t("commun.ranking")} :
            </Typography>
            <Typography variant="h2" noWrap>
              <Trans
                i18nKey={t("commun.position")}
                values={{
                  count: stat.ranking,
                }}
                components={{ sup: <sup /> }}
              />
            </Typography>
            <Typography variant="caption">
              ({t("commun.top")} : {topPercent}%)
            </Typography>
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
            <Typography variant="h4" noWrap>
              {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
            </Typography>
            <Typography variant="body1" noWrap>
              ({stat.scoreavg.toFixed(1)})
            </Typography>
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
            <Typography variant="h4" noWrap>
              {(stat.time / 1000).toFixed(2)}s
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

interface PropsResultYearChallengeBlock {
  date: Moment;
}

export const ResultYearChallengeBlock = ({
  date,
}: PropsResultYearChallengeBlock) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [stat, setStat] = useState<null | ChallengeRankingMonth>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    countRankingChallengeByYear(date.format("YYYY")).then(({ count }) => {
      setNumberPlayers(count);
    });
  }, [date]);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        selectRankingChallengeByYearAndProfileId(
          date.format("YYYY"),
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
    stat && (
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
            <Typography variant="h4" noWrap>
              {t("commun.ranking")} :
            </Typography>
            <Typography variant="h2" noWrap>
              <Trans
                i18nKey={t("commun.position")}
                values={{
                  count: stat.ranking,
                }}
                components={{ sup: <sup /> }}
              />
            </Typography>
            <Typography variant="caption">
              ({t("commun.top")} : {topPercent}%)
            </Typography>
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
            <Typography variant="h4" noWrap>
              {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
            </Typography>
            <Typography variant="body1" noWrap>
              ({stat.scoreavg.toFixed(1)})
            </Typography>
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
            <Typography variant="h4" noWrap>
              {(stat.time / 1000).toFixed(2)}s
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

export const ResultAllTimeChallengeBlock = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [stat, setStat] = useState<null | ChallengeRankingMonth>(null);
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
    stat && (
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
            <Typography variant="h4" noWrap>
              {t("commun.ranking")} :
            </Typography>
            <Typography variant="h2" noWrap>
              <Trans
                i18nKey={t("commun.position")}
                values={{
                  count: stat.ranking,
                }}
                components={{ sup: <sup /> }}
              />
            </Typography>
            <Typography variant="caption">
              ({t("commun.top")} : {topPercent}%)
            </Typography>
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
            <Typography variant="h4" noWrap>
              {stat.score} / {stat.games * NUMBER_QUESTIONS_CHALLENGE}
            </Typography>
            <Typography variant="body1" noWrap>
              ({stat.scoreavg.toFixed(1)})
            </Typography>
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
            <Typography variant="h4" noWrap>
              {(stat.time / 1000).toFixed(2)}s
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  );
};
