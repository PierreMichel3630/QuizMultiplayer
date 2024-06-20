import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getProfilById } from "src/api/profile";
import { ButtonColor } from "src/component/Button";
import { CountryBlock } from "src/component/CountryBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

import BoltIcon from "@mui/icons-material/Bolt";
import { percent, px } from "csx";
import { Helmet } from "react-helmet-async";
import { selectBadgeByProfile } from "src/api/badge";
import { selectRankByProfile } from "src/api/rank";
import {
  selectOppositionByOpponent,
  selectScoresByProfile,
} from "src/api/score";
import { selectTitleByProfile } from "src/api/title";
import { FriendButton } from "src/component/FriendButton";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { BarVictory } from "src/component/chart/BarVictory";
import { DonutGames } from "src/component/chart/DonutGames";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Rank } from "src/models/Rank";
import { Opposition, Score } from "src/models/Score";
import { Title, TitleProfile } from "src/models/Title";
import { sortByDuelGamesDesc, sortByTitle } from "src/utils/sort";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EditIcon from "@mui/icons-material/Edit";
import { CardBadge } from "src/component/card/CardBadge";
import { CardTitle } from "src/component/card/CardTitle";

export const ProfilPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid, language } = useUser();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [scores, setScores] = useState<Array<Score>>([]);
  const [ranks, setRanks] = useState<Array<Rank>>([]);
  const [titles, setTitles] = useState<Array<Title>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [oppositions, setOppositions] = useState<Array<Opposition>>([]);

  const isMe = id === uuid;

  useEffect(() => {
    const getBadges = () => {
      if (id) {
        selectBadgeByProfile(id).then(({ data }) => {
          const res = data as Array<BadgeProfile>;
          setBadges(res.map((el) => el.badge));
        });
      }
    };
    const getTitles = () => {
      if (id) {
        selectTitleByProfile(id).then(({ data }) => {
          const res = data as Array<TitleProfile>;
          setTitles(res.map((el) => el.title));
        });
      }
    };
    getTitles();
    getBadges();
  }, [id]);

  useEffect(() => {
    const getScore = () => {
      if (id) {
        selectScoresByProfile(id).then(({ data }) => {
          const res = data as Array<Score>;
          setScores(res.sort(sortByDuelGamesDesc));
        });
      }
    };
    const getRank = () => {
      if (id) {
        selectRankByProfile(id).then(({ data }) => {
          setRanks(data as Array<Rank>);
        });
      }
    };
    getRank();
    getScore();
  }, [id]);

  useEffect(() => {
    const getOpposition = () => {
      if (id) {
        selectOppositionByOpponent(uuid, id).then(({ data }) => {
          setOppositions(data as Array<Opposition>);
        });
      }
    };
    getOpposition();
  }, [id, uuid]);

  useEffect(() => {
    const getProfile = () => {
      if (id) {
        getProfilById(id).then(({ data }) => {
          setProfileUser(data as Profile);
        });
      }
    };
    getProfile();
  }, [id]);

  const launchDuel = () => {
    navigate(`/play`, { state: { opponent: profileUser } });
  };

  const compare = () => {
    if (user) {
      navigate(`/compare`, {
        state: { profile1: profile, profile2: profileUser },
      });
    } else {
      navigate(`/login`);
    }
  };

  const totalSolo = useMemo(
    () => scores.reduce((acc, value) => acc + value.games, 0),
    [scores]
  );

  const totalScore = useMemo(
    () =>
      scores.reduce(
        (acc, value) => ({
          victory: acc.victory + value.victory,
          draw: acc.draw + value.draw,
          defeat: acc.defeat + value.defeat,
        }),
        { victory: 0, draw: 0, defeat: 0 }
      ),
    [scores]
  );

  const titleOrder = useMemo(
    () => titles.sort((a, b) => sortByTitle(language, a, b)),
    [titles, language]
  );

  return (
    profileUser && (
      <Box>
        <Helmet>
          <title>{`${profileUser.username} - ${t("appname")}`}</title>
        </Helmet>
        <Box
          sx={{
            p: 1,
            backgroundColor: Colors.blue3,
            backgroundImage: `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.blue3} 46%, ${Colors.blue} 100%)`,
            position: "relative",
          }}
        >
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <AvatarAccountBadge
                profile={profileUser}
                size={120}
                color={Colors.white}
                backgroundColor={Colors.grey2}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography variant="h2" color="text.secondary">
                {profileUser.username}
              </Typography>
              {profileUser.title && (
                <JsonLanguageBlock
                  variant="caption"
                  color="text.secondary"
                  value={profileUser.title.name}
                />
              )}
            </Grid>
            {profileUser.country && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CountryBlock id={profileUser.country} color="text.secondary" />
              </Grid>
            )}
            {!isMe && (
              <>
                <Grid item xs={12}>
                  <ButtonColor
                    value={Colors.red}
                    label={t("commun.duel")}
                    icon={BoltIcon}
                    variant="contained"
                    onClick={launchDuel}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonColor
                    value={Colors.blue}
                    label={t("commun.compare")}
                    icon={CompareArrowsIcon}
                    variant="contained"
                    onClick={compare}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FriendButton profile={profileUser} />
                </Grid>
              </>
            )}
          </Grid>
          {isMe && (
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <EditIcon
                sx={{ cursor: "pointer", color: Colors.white }}
                onClick={() => navigate("/personalized")}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {badges.length > 0 && (
              <Grid item xs={12}>
                <CardBadge badges={badges} />
              </Grid>
            )}
            {titleOrder.length > 0 && (
              <Grid item xs={12}>
                <CardTitle titles={titleOrder} />
              </Grid>
            )}
            <Grid item xs={12}>
              <DonutGames
                scores={scores}
                totalScore={totalScore}
                totalSolo={totalSolo}
              />
            </Grid>
            {scores.map((score) => {
              const opposition = oppositions.find(
                (el) => el.theme === score.theme.id
              );
              const rank = ranks.find((el) => el.theme.id === score.theme.id);
              return (
                <Grid item xs={12} sm={6} md={6} lg={4} key={score.id}>
                  <Paper
                    sx={{
                      overflow: "hidden",
                      backgroundColor: Colors.lightgrey,
                      height: percent(100),
                    }}
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: Colors.blue3,
                          p: px(5),
                        }}
                      >
                        <ImageThemeBlock theme={score.theme} size={40} />
                        <JsonLanguageBlock
                          variant="h2"
                          sx={{
                            wordWrap: "anywhere",
                            fontSize: 18,
                          }}
                          color="text.secondary"
                          value={score.theme.name}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ p: 1 }}>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          {score && score.duelgames > 0 && (
                            <>
                              <Grid item xs={12}>
                                <Typography variant="h4" component="span">
                                  {t("commun.duel")}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "center" }}>
                                <Typography variant="body1" component="span">
                                  {t("commun.games")} {" : "}
                                </Typography>
                                <Typography variant="h4" component="span">
                                  {score ? score.duelgames : "0"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "center" }}>
                                <Typography variant="body1" component="span">
                                  {t("commun.points")} {" : "}
                                </Typography>
                                <Typography variant="h4" component="span">
                                  {rank ? rank.points : "-"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <BarVictory
                                  victory={score.victory}
                                  draw={score.draw}
                                  defeat={score.defeat}
                                />
                              </Grid>
                            </>
                          )}

                          {opposition && (
                            <>
                              <Grid item xs={12}>
                                <Divider sx={{ borderBottomWidth: 3 }} />
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="h4" component="span">
                                  {t("commun.opposition")}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <BarVictory
                                  victory={opposition.victory}
                                  draw={opposition.draw}
                                  defeat={opposition.defeat}
                                />
                              </Grid>
                            </>
                          )}
                          {score && score.games > 0 && (
                            <>
                              {(opposition || score.duelgames > 0) && (
                                <Grid item xs={12}>
                                  <Divider sx={{ borderBottomWidth: 3 }} />
                                </Grid>
                              )}
                              <Grid item xs={12}>
                                <Grid
                                  container
                                  spacing={1}
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Grid item xs={12}>
                                    <Typography variant="h4" component="span">
                                      {t("commun.solo")}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={6}
                                    sx={{ textAlign: "center" }}
                                  >
                                    <Typography
                                      variant="body1"
                                      component="span"
                                    >
                                      {t("commun.games")} {" : "}
                                    </Typography>
                                    <Typography variant="h4" component="span">
                                      {score ? score.games : "0"}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={6}
                                    sx={{ textAlign: "center" }}
                                  >
                                    <Typography
                                      variant="body1"
                                      component="span"
                                    >
                                      {t("commun.bestscore")} {" : "}
                                    </Typography>
                                    <Typography variant="h4" component="span">
                                      {score ? score.points : "-"}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    )
  );
};
