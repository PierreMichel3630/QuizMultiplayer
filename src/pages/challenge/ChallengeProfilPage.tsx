import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Colors } from "src/style/Colors";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  countChallengeGameByDateAndProfileId,
  selectChallengeGameByProfileId,
  selectRankingChallengeMonthByProfileId,
  selectRankingChallengeWeekByProfileId,
} from "src/api/challenge";
import { getProfilById } from "src/api/profile";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { ButtonColor } from "src/component/Button";
import { GroupButtonChallengeTime } from "src/component/button/ButtonGroup";
import {
  CardChallengeMonth,
  CardChallengeWeek,
} from "src/component/card/CardChallenge";
import { CardChallengeGame } from "src/component/card/CardChallengeGame";
import { RatingChallenge } from "src/component/challenge/RatingChallenge";
import {
  ResultAllTimeChallengeBlock,
  ResultDayChallengeBlock,
  ResultMonthChallengeBlock,
  ResultWeekChallengeBlock,
  ResultYearChallengeBlock,
} from "src/component/ChallengeBlock";
import { CountryImageBlock } from "src/component/CountryBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useAuth } from "src/context/AuthProviderSupabase";
import {
  ChallengeRanking,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { ClassementChallengeTimeEnum } from "src/models/enum/ClassementEnum";
import { Profile } from "src/models/Profile";

export default function ChallengeProfilPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tabTime, setTabTime] = useState(ClassementChallengeTimeEnum.day);
  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [games, setGames] = useState<Array<ChallengeRanking>>([]);
  const [statMonth, setStatMonth] = useState<Array<ChallengeRankingMonth>>([]);
  const [statWeek, setStatWeek] = useState<Array<ChallengeRankingWeek>>([]);

  const [hasPlayChallenge, setHasPlayChallenge] = useState<undefined | boolean>(
    undefined
  );

  useEffect(() => {
    const getGames = () => {
      if (profileUser) {
        selectChallengeGameByProfileId(profileUser.id).then(({ data }) => {
          setGames(data ?? []);
        });
      }
    };
    const getStatMonth = () => {
      if (profileUser) {
        selectRankingChallengeMonthByProfileId(profileUser.id).then(
          ({ data }) => {
            setStatMonth(data ?? []);
          }
        );
      }
    };
    const getStatWeek = () => {
      if (profileUser) {
        selectRankingChallengeWeekByProfileId(profileUser.id).then(
          ({ data }) => {
            setStatWeek(data ?? []);
          }
        );
      }
    };
    getGames();
    getStatWeek();
    getStatMonth();
  }, [profileUser]);

  useEffect(() => {
    const getProfile = () => {
      if (uuid) {
        getProfilById(uuid).then(({ data }) => {
          setProfileUser(data as Profile);
        });
      }
    };
    getProfile();
  }, [uuid]);

  useEffect(() => {
    const isChallengeAvailable = () => {
      if (profile) {
        const date = moment();
        countChallengeGameByDateAndProfileId(date, profile.id).then(
          ({ count }) => {
            setHasPlayChallenge(count !== null && count > 0);
          }
        );
      }
    };
    isChallengeAvailable();
  }, [profile]);

  console.log(statWeek);

  return (
    <Grid
      container
      sx={{ minHeight: viewHeight(100) }}
      alignContent="flex-start"
    >
      <Helmet>
        <title>{`${t("commun.profilechallenge")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation
        title={t("commun.daychallenge")}
        quit={() => navigate("/challenge")}
      />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {profileUser && (
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AvatarAccountBadge profile={profileUser} size={60} />
                  <Box>
                    <Box sx={{ display: "flex", gap: px(3) }}>
                      {profileUser.country && (
                        <CountryImageBlock country={profileUser.country} />
                      )}
                      <Typography variant="h2">
                        {profileUser.username}
                      </Typography>
                    </Box>
                    {profileUser.title && (
                      <JsonLanguageBlock
                        variant="caption"
                        value={profileUser.title.name}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <GroupButtonChallengeTime
                    selected={tabTime}
                    onChange={(value) => {
                      setTabTime(value);
                    }}
                  />
                </Grid>
                {
                  {
                    day: (
                      <>
                        <Grid item xs={12}>
                          <ResultDayChallengeBlock
                            profile={profileUser}
                            title={t("commun.day")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <RatingChallenge />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ borderBottomWidth: 5 }} />
                        </Grid>
                        {games.map((game) => (
                          <Grid item xs={12} key={game.id}>
                            <CardChallengeGame
                              game={game}
                              hasPlayChallenge={hasPlayChallenge}
                            />
                          </Grid>
                        ))}
                      </>
                    ),
                    week: (
                      <>
                        <Grid item xs={12}>
                          <ResultWeekChallengeBlock
                            profile={profileUser}
                            title={t("commun.week")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ borderBottomWidth: 5 }} />
                        </Grid>
                        {statWeek.map((stat, index) => (
                          <Grid item xs={12} key={index}>
                            <CardChallengeWeek value={stat} />
                          </Grid>
                        ))}
                      </>
                    ),
                    month: (
                      <>
                        <Grid item xs={12}>
                          <ResultMonthChallengeBlock
                            profile={profileUser}
                            title={t("commun.month")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ borderBottomWidth: 5 }} />
                        </Grid>
                        {statMonth.map((stat, index) => (
                          <Grid item xs={12} key={index}>
                            <CardChallengeMonth value={stat} />
                          </Grid>
                        ))}
                      </>
                    ),
                    year: (
                      <>
                        <Grid item xs={12}>
                          <ResultYearChallengeBlock
                            profile={profileUser}
                            title={t("commun.year")}
                          />
                        </Grid>
                      </>
                    ),
                    alltime: (
                      <>
                        <Grid item xs={12}>
                          <ResultAllTimeChallengeBlock
                            profile={profileUser}
                            title={t("commun.alltime")}
                          />
                        </Grid>
                      </>
                    ),
                  }[tabTime]
                }
              </Grid>
            )}
          </Box>
        </Container>
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              flexDirection: "column",
            }}
          >
            <ButtonColor
              value={Colors.blue}
              label={t("commun.return")}
              icon={KeyboardReturnIcon}
              onClick={() => {
                const path =
                  location.state !== null && location.state.previousPath;
                navigate(path ? location.state.previousPath : "/challenge");
              }}
              variant="contained"
            />
          </Box>
        </Container>
      </Box>
    </Grid>
  );
}
