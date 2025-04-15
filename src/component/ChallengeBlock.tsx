import { Box, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import {
  ChallengeGame,
  ChallengeRanking,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import moment, { Moment } from "moment";
import { Profile } from "src/models/Profile";
import { PositionTypography } from "./typography/PositionTypography";

interface PropsBase {
  profile: Profile | null;
  title?: string;
}

interface PropsResultDayChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultDayChallengeBlock = ({
  date,
  profile,
  title,
}: PropsResultDayChallengeBlock) => {
  const { t } = useTranslation();

  const [game, setGame] = useState<null | ChallengeGame>(null);
  const [rank, setRank] = useState<null | ChallengeRanking>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

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
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            <PositionTypography position={rank.ranking} />
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
            xs={4}
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

interface PropsResultWeekChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultWeekChallengeBlock = ({
  date,
  profile,
  title,
}: PropsResultWeekChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingWeek>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

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
        selectRankingChallengeByWeekAndProfileId(
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
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            <PositionTypography position={stat.ranking} />
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

interface PropsResultMonthChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultMonthChallengeBlock = ({
  date,
  profile,
  title,
}: PropsResultMonthChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingMonth>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

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
        selectRankingChallengeByMonthAndProfileId(
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
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            <PositionTypography position={stat.ranking} />
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

interface PropsResultYearChallengeBlock extends PropsBase {
  date?: Moment;
}

export const ResultYearChallengeBlock = ({
  date,
  profile,
  title,
}: PropsResultYearChallengeBlock) => {
  const { t } = useTranslation();

  const [stat, setStat] = useState<null | ChallengeRankingMonth>(null);
  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);

  useEffect(() => {
    const valueDate = date ?? moment();
    countRankingChallengeByYear(valueDate.format("YYYY")).then(({ count }) => {
      setNumberPlayers(count);
    });
  }, [date]);

  useEffect(() => {
    const getStat = () => {
      if (profile) {
        const valueDate = date ?? moment();
        selectRankingChallengeByYearAndProfileId(
          valueDate.format("YYYY"),
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
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            <PositionTypography position={stat.ranking} />
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

export const ResultAllTimeChallengeBlock = ({ profile, title }: PropsBase) => {
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
            {title && (
              <Typography variant="h4" noWrap>
                {title}
              </Typography>
            )}
            <PositionTypography position={stat.ranking} />
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
