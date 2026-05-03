import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Box, Divider, Grid, Link, Paper, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import {
  ChallengeRankingAllTime,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import moment from "moment";
import { selectChallengeAllTimeByProfile } from "src/api/challenge";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Rank } from "../ranking/Rank";
import { CardSignalQuestion } from "./CardQuestion";

interface Props {
  profileId: string | undefined;
}
export const CardChallenge = ({ profileId }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [numberPlayers, setNumberPlayers] = useState<null | number>(null);
  const [stat, setStat] = useState<null | ChallengeRankingAllTime>(null);

  useEffect(() => {
    if (profileId) {
      selectChallengeAllTimeByProfile(profileId).then(({ data }) => {
        const values: Array<ChallengeRankingAllTime> = data.data;
        const count: number = data.count;
        setStat(values[0] ?? null);
        setNumberPlayers(count);
      });
    }
  }, [profileId]);

  const topPercent = useMemo(
    () =>
      stat && numberPlayers
        ? ((stat.ranking / numberPlayers) * 100).toFixed(2)
        : undefined,
    [numberPlayers, stat],
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
          sx={{
            backgroundColor: Colors.colorApp,
            p: px(10),
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
          size={12}
        >
          <Typography variant="h2" color="text.secondary">
            {t("commun.daychallenge")}
          </Typography>
        </Grid>
        <Grid
          sx={{
            display: "flex",
            p: 1,
          }}
          size={12}
        >
          <Grid container spacing={1} justifyContent="center">
            {stat && (
              <>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                  size={6}
                >
                  <Rank value={stat.ranking} />
                  <Typography variant="caption">
                    ({t("commun.top")} : {topPercent}%)
                  </Typography>
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
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  size={6}
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
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  size={6}
                >
                  <AccessTimeIcon />
                  <Typography variant="h4" noWrap>
                    {(stat.time / 1000).toFixed(2)}s
                  </Typography>
                </Grid>
              </>
            )}
            {profileId && (
              <Grid size={12}>
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

interface CardChallengeDayProps {
  value: ChallengeRankingDay;
}

export const CardChallengeDay = ({ value }: CardChallengeDayProps) => {
  const { hasPlayChallenge } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const showGame = useMemo(() => {
    const result =
      hasPlayChallenge || moment(value.date).diff(moment(), "day") < 0;
    return result;
  }, [hasPlayChallenge, value]);

  return (
    <Paper
      sx={{
        p: padding(10, 20),
        cursor: showGame ? "pointer" : "default",
        position: "relative",
      }}
      elevation={8}
      onClick={() => {
        if (showGame) {
          setIsOpen((prev) => !prev);
        }
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid size={12}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Grid size={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h6">
                {moment(value.date).format("DD/MM/YY")}
              </Typography>
            </Grid>
            <Grid size={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Rank value={value.ranking} />
            </Grid>
            <Grid size={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
                <QuestionMarkIcon fontSize="small" />
                <Typography variant="h6" noWrap>
                  {showGame ? value.score : "-"} / {NUMBER_QUESTIONS_CHALLENGE}
                </Typography>
              </Box>
            </Grid>
            <Grid size={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="h6" noWrap>
                  {showGame ? `${(value.time / 1000).toFixed(2)}s` : "--.--s"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {isOpen ? (
          <Grid size={12}>
            <Grid container spacing={1}>
              {value.questions.map((el, index) => (
                <Fragment key={index}>
                  <Grid size={12}>
                    <CardSignalQuestion question={el} version={value.version} />
                  </Grid>
                  <Grid size={12}>
                    <Divider
                      sx={{
                        borderBottomWidth: 5,
                        borderColor: Colors.white,
                        borderRadius: px(5),
                      }}
                    />
                  </Grid>
                </Fragment>
              ))}
            </Grid>
          </Grid>
        ) : (
          <>
            {showGame && (
              <Grid size={12} sx={{ textAlign: "center" }}>
                <Link>
                  <Typography variant="body1">Voir la partie</Typography>
                </Link>
              </Grid>
            )}
          </>
        )}
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
        p: padding(10, 20),
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
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          size={12}
        >
          <Typography variant="h6">
            {start.format("DD MMMM")} - {end.format("DD MMMM YYYY")}
          </Typography>
          <Rank value={value.ranking} />
        </Grid>
        <Grid size={12}>
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
        p: padding(10, 20),
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
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          size={12}
        >
          <Typography variant="h6">
            {moment(value.month, "MM/YYYY").format("MMMM YYYY")}
          </Typography>
          <Rank value={value.ranking} />
        </Grid>
        <Grid size={12}>
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
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "baseline",
            justifyContent: "center",
          }}
          size={12}
        >
          <Rank value={value.ranking} />
        </Grid>
        <Grid size={12}>
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
