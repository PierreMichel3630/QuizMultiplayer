import { Box, Container, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px } from "csx";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Colors } from "src/style/Colors";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useEffect, useState } from "react";
import {
  selectChallengeGameByProfileId,
  selectRankingChallengeAllTimeByProfileId,
  selectRankingChallengeMonthByProfileId,
  selectRankingChallengeWeekByProfileId,
} from "src/api/challenge";
import { getProfilById } from "src/api/profile";
import { ButtonColor } from "src/component/Button";
import { GroupButtonChallengeTime } from "src/component/button/ButtonGroup";
import {
  CardChallengeAllTime,
  CardChallengeMonth,
  CardChallengeWeek,
} from "src/component/card/CardChallenge";
import { CardChallengeGame } from "src/component/card/CardChallengeGame";
import { RatingChallenge } from "src/component/challenge/RatingChallenge";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import {
  ChallengeRanking,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { ClassementChallengeTimeEnum } from "src/models/enum/ClassementEnum";
import { Profile } from "src/models/Profile";

export default function ChallengeProfilPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tabTime, setTabTime] = useState(ClassementChallengeTimeEnum.day);
  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [games, setGames] = useState<Array<ChallengeRanking>>([]);
  const [statMonth, setStatMonth] = useState<Array<ChallengeRankingMonth>>([]);
  const [statWeek, setStatWeek] = useState<Array<ChallengeRankingWeek>>([]);
  const [statAllTime, setStatAllTime] =
    useState<null | ChallengeRankingAllTime>(null);

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

    const getStatAllTime = () => {
      if (profileUser) {
        selectRankingChallengeAllTimeByProfileId(profileUser.id).then(
          ({ data }) => {
            setStatAllTime(data);
          }
        );
      }
    };
    getGames();
    getStatWeek();
    getStatMonth();
    getStatAllTime();
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

  return (
    <Grid container className="page" alignContent="flex-start">
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
                <Grid item xs={12}>
                  <ProfileBlock profile={profileUser} />
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
                          <RatingChallenge />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ borderBottomWidth: 5 }} />
                        </Grid>
                        {games.map((game) => (
                          <Grid item xs={12} key={game.id}>
                            <CardChallengeGame game={game} />
                          </Grid>
                        ))}
                      </>
                    ),
                    week: (
                      <>
                        {statWeek.map((stat, index) => (
                          <Grid item xs={12} key={index}>
                            <CardChallengeWeek value={stat} />
                          </Grid>
                        ))}
                      </>
                    ),
                    month: (
                      <>
                        {statMonth.map((stat, index) => (
                          <Grid item xs={12} key={index}>
                            <CardChallengeMonth value={stat} />
                          </Grid>
                        ))}
                      </>
                    ),
                    alltime: (
                      <>
                        {statAllTime && (
                          <Grid item xs={12}>
                            <CardChallengeAllTime value={statAllTime} />
                          </Grid>
                        )}
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
