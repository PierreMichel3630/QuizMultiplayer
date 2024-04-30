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
import { BadgeTitle } from "src/component/Badge";
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
import { sortByDuelGamesDesc } from "src/utils/sort";

import EditIcon from "@mui/icons-material/Edit";

export const ProfilPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | undefined>(undefined);
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
          setProfile(data as Profile);
        });
      }
    };
    getProfile();
  }, [id]);

  const launchDuel = () => {
    navigate(`/play`, { state: { opponent: profile } });
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

  return (
    profile && (
      <Box>
        <Helmet>
          <title>{`${profile.username} - ${t("appname")}`}</title>
        </Helmet>
        <Box
          sx={{
            p: 1,
            backgroundColor: "#4158D0",
            backgroundImage:
              "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
            position: "relative",
          }}
        >
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <AvatarAccountBadge
                profile={profile}
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
                {profile.username}
              </Typography>
              {profile.title && (
                <JsonLanguageBlock
                  variant="caption"
                  color="text.secondary"
                  value={profile.title.name}
                />
              )}
            </Grid>
            {profile.country && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CountryBlock id={profile.country} color="text.secondary" />
              </Grid>
            )}
            {!isMe && (
              <>
                <Grid item xs={6} sm={6} md={4}>
                  <ButtonColor
                    value={Colors.red}
                    label={t("commun.duel")}
                    icon={BoltIcon}
                    variant="contained"
                    onClick={launchDuel}
                  />
                </Grid>
                {user && (
                  <Grid item xs={6} sm={6} md={4}>
                    <FriendButton profile={profile} />
                  </Grid>
                )}
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
                <Paper
                  sx={{ overflow: "hidden", backgroundColor: Colors.lightgrey }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        backgroundColor: Colors.red,
                        p: px(10),
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: 18,
                        }}
                        color="text.secondary"
                      >
                        {t("commun.badges")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", p: 1 }}>
                      <Grid container spacing={1}>
                        {badges.map((badge) => (
                          <Grid item>
                            <img src={badge.icon} width={40} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
            {titles.length > 0 && (
              <Grid item xs={12}>
                <Paper
                  sx={{ overflow: "hidden", backgroundColor: Colors.lightgrey }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        backgroundColor: Colors.red,
                        p: px(10),
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: 18,
                        }}
                        color="text.secondary"
                      >
                        {t("commun.titles")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", p: 1 }}>
                      <Grid container spacing={1}>
                        {titles.map((title) => (
                          <Grid item>
                            <BadgeTitle label={title.name} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
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
                          backgroundColor: Colors.red,
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
                          {score && (
                            <Grid item xs={12}>
                              <BarVictory
                                victory={score.victory}
                                draw={score.draw}
                                defeat={score.defeat}
                              />
                            </Grid>
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
                          <Grid item xs={12}>
                            <Divider sx={{ borderBottomWidth: 3 }} />
                          </Grid>
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
                              <Grid item xs={6} sx={{ textAlign: "center" }}>
                                <Typography variant="body1" component="span">
                                  {t("commun.games")} {" : "}
                                </Typography>
                                <Typography variant="h4" component="span">
                                  {score ? score.games : "0"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "center" }}>
                                <Typography variant="body1" component="span">
                                  {t("commun.bestscore")} {" : "}
                                </Typography>
                                <Typography variant="h4" component="span">
                                  {score ? score.points : "-"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
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
