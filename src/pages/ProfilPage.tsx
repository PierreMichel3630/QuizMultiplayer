import { Alert, Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { Opposition, Score } from "src/models/Score";
import { Title, TitleProfile } from "src/models/Title";
import {
  sortByDuelGamesDesc,
  sortByGamesDesc,
  sortByName,
  sortByPointsDesc,
  sortByRankDesc,
  sortByTitle,
} from "src/utils/sort";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EditIcon from "@mui/icons-material/Edit";
import { BasicSearchInput } from "src/component/Input";
import { SortButton } from "src/component/SortBlock";
import { CardBadge } from "src/component/card/CardBadge";
import { CardTitle } from "src/component/card/CardTitle";
import { searchString } from "src/utils/string";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CardOpposition } from "src/component/card/CardOpposition";
import { StatusProfileBlock } from "src/component/StatusProfileBlock";

export default function ProfilPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid, language } = useUser();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [scores, setScores] = useState<Array<Score>>([]);
  const [titles, setTitles] = useState<Array<Title>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [oppositions, setOppositions] = useState<Array<Opposition>>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("alphabetical");
  const [isLoading, setIsLoading] = useState(true);

  const isMe = useMemo(() => id === uuid, [id, uuid]);
  const totalOpposition = useMemo(
    () =>
      oppositions.reduce(
        (acc, value) => ({
          games: acc.games + value.games,
          victory: acc.victory + value.victory,
          draw: acc.draw + value.draw,
          defeat: acc.defeat + value.defeat,
        }),
        { games: 0, victory: 0, draw: 0, defeat: 0 }
      ),
    [oppositions]
  );

  const sorts = [
    { value: "alphabetical", label: t("sort.alphabetical"), sort: setSort },
    { value: "gamessolo", label: t("sort.gamessolo"), sort: setSort },
    { value: "gamesduel", label: t("sort.gamesduel"), sort: setSort },
    { value: "scoresolo", label: t("sort.scoresolo"), sort: setSort },
    { value: "scoreduel", label: t("sort.scoreduel"), sort: setSort },
  ];

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
      setIsLoading(true);
      if (id) {
        selectScoresByProfile(id).then(({ data }) => {
          const res = data as Array<Score>;
          setScores(res.sort(sortByDuelGamesDesc));
          setIsLoading(false);
        });
      }
    };
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

  const scoresWithRankAndOpposition = useMemo(() => {
    const result = scores.map((score) => {
      const opposition = oppositions.find((el) => el.theme === score.theme.id);

      return { ...score, opposition: opposition };
    });
    return result;
  }, [scores, oppositions]);

  const scoresDisplay = useMemo(() => {
    let res = [...scoresWithRankAndOpposition].filter((el) =>
      searchString(search, el.theme.name[language.iso])
    );
    switch (sort) {
      case "alphabetical":
        res = [...res].sort((a, b) => sortByName(language, a.theme, b.theme));
        break;
      case "gamessolo":
        res = [...res].sort(sortByGamesDesc);
        break;
      case "gamesduel":
        res = [...res].sort(sortByDuelGamesDesc);
        break;
      case "scoresolo":
        res = [...res].sort(sortByPointsDesc);
        break;
      case "scoreduel":
        res = [...res].sort(sortByRankDesc);
        break;
      default:
        res = [...res].sort((a, b) => sortByName(language, a.theme, b.theme));
        break;
    }

    return res;
  }, [scoresWithRankAndOpposition, search, language, sort]);

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
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <StatusProfileBlock
                online={profileUser.isonline}
                color="text.secondary"
              />
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
            {!isLoading && scores.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="warning">{t("commun.noresultgame")}</Alert>
              </Grid>
            )}
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
            {totalOpposition.games > 0 && (
              <Grid item xs={12}>
                <CardOpposition
                  opposition={totalOpposition}
                  opponent={profileUser}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <DonutGames
                scores={scores}
                totalScore={totalScore}
                totalSolo={totalSolo}
                profile={profileUser}
                loading={isLoading}
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          {(isLoading || scores.length > 0) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: px(5),
                p: 1,
                position: "sticky",
                top: px(55),
                backgroundColor: "white",
                width: percent(100),
              }}
            >
              <BasicSearchInput
                label={t("commun.searchtheme")}
                onChange={(value) => setSearch(value)}
                value={search}
                clear={() => setSearch("")}
              />
              <SortButton menus={sorts} />
            </Box>
          )}
          <Box sx={{ p: 1 }}>
            <Grid container spacing={1}>
              {scoresDisplay.map((score) => {
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
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
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
                          </Box>
                          <Link
                            to={`/games`}
                            state={{
                              player: profileUser,
                              themes: [score.theme],
                            }}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <VisibilityIcon
                              fontSize="large"
                              sx={{ color: "white" }}
                            />
                          </Link>
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
                                    {score.rank}
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

                            {score.opposition && (
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
                                    victory={score.opposition.victory}
                                    draw={score.opposition.draw}
                                    defeat={score.opposition.defeat}
                                  />
                                </Grid>
                              </>
                            )}
                            {score && score.games > 0 && (
                              <>
                                {(score.opposition || score.duelgames > 0) && (
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
      </Box>
    )
  );
}
