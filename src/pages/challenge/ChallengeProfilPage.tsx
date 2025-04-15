import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Colors } from "src/style/Colors";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useEffect, useState } from "react";
import {
  countChallengeGameByDateAndProfileId,
  selectChallengeGameByProfileId,
} from "src/api/challenge";
import { getProfilById } from "src/api/profile";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { ButtonColor } from "src/component/Button";
import { CardChallengeGame } from "src/component/card/CardChallengeGame";
import {
  ResultAllTimeChallengeBlock,
  ResultDayChallengeBlock,
  ResultMonthChallengeBlock,
  ResultWeekChallengeBlock,
} from "src/component/ChallengeBlock";
import { CountryImageBlock } from "src/component/CountryBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ChallengeRanking } from "src/models/Challenge";
import { Profile } from "src/models/Profile";
import { useAuth } from "src/context/AuthProviderSupabase";
import moment from "moment";

export default function ChallengeProfilPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [games, setGames] = useState<Array<ChallengeRanking>>([]);
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
    getGames();
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
                <Grid item xs={12} sm={6}>
                  <ResultDayChallengeBlock
                    profile={profileUser}
                    title={t("commun.day")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ResultWeekChallengeBlock
                    profile={profileUser}
                    title={t("commun.week")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ResultMonthChallengeBlock
                    profile={profileUser}
                    title={t("commun.month")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ResultAllTimeChallengeBlock
                    profile={profileUser}
                    title={t("commun.alltime")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h2">{t("commun.games")}</Typography>
                </Grid>
                {games.map((game) => (
                  <Grid item xs={12} key={game.id}>
                    <CardChallengeGame
                      game={game}
                      hasPlayChallenge={hasPlayChallenge}
                    />
                  </Grid>
                ))}
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
