import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  countRankingChallengeAllTime,
  selectRankingChallengeAllTimeByProfileId,
} from "src/api/challenge";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import {
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { PositionTypography } from "../typography/PositionTypography";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import moment from "moment";

interface Props {
  profileId: string | undefined;
}
export const CardChallenge = ({ profileId }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);
  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);

  useEffect(() => {
    countRankingChallengeAllTime().then(({ count }) => {
      setNumberPlayers(count);
    });
  }, []);

  useEffect(() => {
    if (profileId) {
      selectRankingChallengeAllTimeByProfileId(profileId).then(({ data }) => {
        setStat(data);
      });
    }
  }, [profileId]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat]
  );

  return (
    <Paper
      sx={{
        overflow: "hidden",
        height: percent(100),
        backgroundColor: Colors.grey,
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.colorApp,
            p: px(10),
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color="text.secondary">
            {t("commun.daychallenge")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            p: 1,
          }}
        >
          <Grid container spacing={1} justifyContent="center">
            {stat && (
              <>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
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
                  <SportsEsportsIcon />
                  <Typography variant="h4">
                    <Trans
                      i18nKey={t("commun.game")}
                      values={{
                        count: stat.games,
                      }}
                    />
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
              </>
            )}
            {profileId && (
              <Grid item xs={12}>
                <ButtonColor
                  value={Colors.blue2}
                  label={t("commun.seestatchallenge")}
                  icon={EmojiEventsIcon}
                  variant="contained"
                  onClick={() => navigate(`/challenge/profil/${profileId}`)}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface CardChallengeWeekProps {
  value: ChallengeRankingWeek;
}

export const CardChallengeWeek = ({ value }: CardChallengeWeekProps) => {
  const { t } = useTranslation();
  const date = useMemo(() => moment(value.week, "WW/YYYY"), [value.week]);

  const start = useMemo(() => date.clone().weekday(1), [date]);
  const end = useMemo(() => date.clone().weekday(7), [date]);
  return (
    <Paper
      sx={{
        p: 1,
      }}
      elevation={8}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ textAlign: "center" }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "baseline",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">
            {start.format("DD MMMM")} - {end.format("DD MMMM YYYY")}
          </Typography>
          <PositionTypography position={value.ranking} />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <SportsEsportsIcon fontSize="small" />
              <Typography variant="h6">
                <Trans
                  i18nKey={t("commun.game")}
                  values={{
                    count: value.games,
                  }}
                />
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <QuestionMarkIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {value.score} / {value.games * NUMBER_QUESTIONS_CHALLENGE}
              </Typography>
              <Typography variant="caption" noWrap>
                ({t("abrevation.average")} {value.scoreavg.toFixed(2)})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {(value.time / 1000).toFixed(2)}s
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface CardChallengeMonthProps {
  value: ChallengeRankingMonth;
}

export const CardChallengeMonth = ({ value }: CardChallengeMonthProps) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 1,
      }}
      elevation={8}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ textAlign: "center" }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "baseline",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">
            {moment(value.month, "MM/YYYY").format("MMMM YYYY")}
          </Typography>
          <PositionTypography position={value.ranking} />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <SportsEsportsIcon fontSize="small" />
              <Typography variant="h6">
                <Trans
                  i18nKey={t("commun.game")}
                  values={{
                    count: value.games,
                  }}
                />
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <QuestionMarkIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {value.score} / {value.games * NUMBER_QUESTIONS_CHALLENGE}
              </Typography>
              <Typography variant="caption" noWrap>
                ({t("abrevation.average")} {value.scoreavg.toFixed(2)})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {(value.time / 1000).toFixed(2)}s
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface CardChallengeAllTimeProps {
  value: ChallengeRankingAllTime;
}

export const CardChallengeAllTime = ({ value }: CardChallengeAllTimeProps) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 1,
      }}
      elevation={8}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ textAlign: "center" }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "baseline",
            justifyContent: "center",
          }}
        >
          <PositionTypography position={value.ranking} />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <SportsEsportsIcon fontSize="small" />
              <Typography variant="h6">
                <Trans
                  i18nKey={t("commun.game")}
                  values={{
                    count: value.games,
                  }}
                />
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <QuestionMarkIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {value.score} / {value.games * NUMBER_QUESTIONS_CHALLENGE}
              </Typography>
              <Typography variant="caption" noWrap>
                ({t("abrevation.average")} {value.scoreavg.toFixed(2)})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {(value.time / 1000).toFixed(2)}s
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
