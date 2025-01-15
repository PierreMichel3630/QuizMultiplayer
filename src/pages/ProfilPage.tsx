import { Alert, Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { getProfilById } from "src/api/profile";
import { CountryBlock } from "src/component/CountryBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

import { percent, px } from "csx";
import { Helmet } from "react-helmet-async";
import { selectBadgeByProfile } from "src/api/badge";
import {
  selectOppositionByOpponent,
  selectScoresByProfile,
} from "src/api/score";
import { selectTitleByProfile } from "src/api/title";
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
  sortByXP,
} from "src/utils/sort";

import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectFriendByProfileId } from "src/api/friend";
import { BasicSearchInput } from "src/component/Input";
import { ProfileAction } from "src/component/ProfileAction";
import { SortButton } from "src/component/SortBlock";
import { StatusProfileBlock } from "src/component/StatusProfileBlock";
import { CardBadge } from "src/component/card/CardBadge";
import { CardFinishTheme } from "src/component/card/CardFinishTheme";
import { CardFriends } from "src/component/card/CardFriends";
import { CardOpposition } from "src/component/card/CardOpposition";
import { CardTitle } from "src/component/card/CardTitle";
import { SkeletonAvatarPlayer } from "src/component/skeleton/SkeletonPlayer";
import { SkeletonProfilTheme } from "src/component/skeleton/SkeletonTheme";
import { useApp } from "src/context/AppProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Friend, FRIENDSTATUS } from "src/models/Friend";
import { getLevel } from "src/utils/calcul";
import { searchString } from "src/utils/string";

export default function ProfilPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid, language } = useUser();
  const { user } = useAuth();
  const { friends, headerSize } = useApp();

  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [scores, setScores] = useState<Array<Score>>([]);
  const [titles, setTitles] = useState<Array<Title>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [oppositions, setOppositions] = useState<Array<Opposition>>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("alphabetical");
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [profileFriends, setProfileFriends] = useState<Array<Friend>>([]);
  const [isLoadingScore, setIsLoadingScore] = useState(true);
  const [isLoadingTitle, setIsLoadingTitle] = useState(true);
  const [isLoadingBadge, setIsLoadingBadge] = useState(true);
  const [isLoadingOppositions, setIsLoadingOppositions] = useState(true);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [isEnd, setIsEnd] = useState(true);
  const [maxIndex, setMaxIndex] = useState(10);

  const isMe = useMemo(() => id === uuid, [id, uuid]);
  const friend = useMemo(
    () =>
      friends.find(
        (el) =>
          user &&
          profileUser &&
          ((el.user1.id === user.id && el.user2.id === profileUser.id) ||
            (el.user2.id === user.id && el.user1.id === profileUser.id))
      ),
    [friends, user, profileUser]
  );

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
    { value: "level", label: t("sort.level"), sort: setSort },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const getStats = () => {
      if (id) {
        selectStatAccomplishmentByProfile(id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getStats();
  }, [id]);

  useEffect(() => {
    const getScore = () => {
      setIsLoadingScore(true);
      if (id) {
        selectScoresByProfile(id).then(({ data }) => {
          const res = data as Array<Score>;
          setScores(res.sort(sortByDuelGamesDesc));
          setIsLoadingScore(false);
        });
      }
    };
    getScore();
  }, [id]);

  useEffect(() => {
    const getTitles = () => {
      setIsLoadingTitle(true);
      if (id) {
        selectTitleByProfile(id).then(({ data }) => {
          const res = data as Array<TitleProfile>;
          setTitles(res.map((el) => el.title));
          setIsLoadingTitle(false);
        });
      }
    };
    getTitles();
  }, [id]);

  useEffect(() => {
    const getBadges = () => {
      setIsLoadingBadge(true);
      if (id) {
        selectBadgeByProfile(id).then(({ data }) => {
          const res = data as Array<BadgeProfile>;
          setBadges(res.map((el) => el.badge));
          setIsLoadingBadge(false);
        });
      }
    };
    getBadges();
  }, [id]);

  useEffect(() => {
    const getFriends = () => {
      setIsLoadingFriends(true);
      if (id) {
        selectFriendByProfileId(id).then(({ data }) => {
          const friends = data as Array<Friend>;
          setProfileFriends(
            friends.filter((el) => el.status !== FRIENDSTATUS.REFUSE)
          );
          setIsLoadingFriends(false);
        });
      }
    };
    getFriends();
  }, [id]);

  useEffect(() => {
    const getOpposition = () => {
      setIsLoadingOppositions(true);
      if (id) {
        selectOppositionByOpponent(uuid, id).then(({ data }) => {
          setOppositions(data as Array<Opposition>);
          setIsLoadingOppositions(false);
        });
      }
    };
    getOpposition();
  }, [id, uuid]);

  useEffect(() => {
    const getProfile = () => {
      setIsLoadingProfile(true);
      if (id) {
        getProfilById(id).then(({ data }) => {
          setProfileUser(data as Profile);
          setIsLoadingProfile(false);
        });
      }
    };
    getProfile();
  }, [id]);

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

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

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
      case "level":
        res = [...res].sort(sortByXP);
        break;
      default:
        res = [...res].sort((a, b) => sortByName(language, a.theme, b.theme));
        break;
    }
    setIsEnd(res.length <= maxIndex);
    return [...res].splice(0, maxIndex);
  }, [scoresWithRankAndOpposition, search, language, sort, maxIndex]);

  const friendsAvatar = useMemo(
    () =>
      profileFriends
        .filter((el) => el.status === FRIENDSTATUS.VALID)
        .reduce(
          (acc, value) =>
            value.user2.id === id
              ? [...acc, value.user1]
              : [...acc, value.user2],
          [] as Array<Profile>
        ),
    [profileFriends, id]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1000 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 10);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scoresWithRankAndOpposition, maxIndex]);

  return (
    <Box>
      <Helmet>
        <title>{`${profileUser ? profileUser.username : ""} - ${t(
          "appname"
        )}`}</title>
      </Helmet>
      <Box
        sx={{
          p: 1,
          backgroundColor: Colors.blue3,
          backgroundImage:
            profileUser && profileUser.banner
              ? `url("/banner/${profileUser.banner.icon}")`
              : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.blue3} 46%, ${Colors.blue} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item sx={{ mb: 1 }}>
            {profileUser && !isLoadingProfile ? (
              <AvatarAccountBadge
                profile={profileUser}
                size={120}
                color={Colors.white}
                backgroundColor={Colors.grey2}
                level={level}
              />
            ) : (
              <SkeletonAvatarPlayer size={120} />
            )}
          </Grid>
          {profileUser && !isLoadingProfile && (
            <>
              <Grid
                item
                xs={12}
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h2"
                  color="text.secondary"
                  sx={{ textShadow: "1px 1px 2px black" }}
                >
                  {profileUser.username}
                </Typography>
                {profileUser.title && (
                  <JsonLanguageBlock
                    variant="caption"
                    color="text.secondary"
                    value={profileUser.title.name}
                    sx={{ textShadow: "1px 1px 2px black" }}
                  />
                )}
              </Grid>
              {!isMe && friend && (
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
              )}
              {profileUser.country && (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <CountryBlock
                    country={profileUser.country}
                    color="text.secondary"
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Box>
      <Box sx={{ p: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ProfileAction profileUser={profileUser} />
          </Grid>
          {!isLoadingScore && scores.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="warning">{t("commun.noresultgame")}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <CardBadge badges={badges} loading={isLoadingBadge} />
          </Grid>
          <Grid item xs={12}>
            <CardTitle titles={titleOrder} loading={isLoadingTitle} />
          </Grid>
          <Grid item xs={12}>
            <CardFriends friends={friendsAvatar} loading={isLoadingFriends} />
          </Grid>
          <Grid item xs={12}>
            <CardFinishTheme scores={scores} loading={isLoadingScore} />
          </Grid>
          {profileUser && totalOpposition.games > 0 && (
            <Grid item xs={12}>
              <CardOpposition
                opposition={totalOpposition}
                opponent={profileUser}
                loading={isLoadingOppositions}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <DonutGames
              scores={scores}
              totalScore={totalScore}
              totalSolo={totalSolo}
              loading={isLoadingScore}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        {(isLoadingScore || scores.length > 0) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: px(5),
              p: 1,
              position: "sticky",
              top: headerSize,
              bgcolor: "background.paper",
              width: percent(100),
              zIndex: 5,
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
                          <Link
                            to={`/theme/${score.theme.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <ImageThemeBlock theme={score.theme} size={50} />
                          </Link>
                          <Box>
                            <JsonLanguageBlock
                              variant="h2"
                              sx={{
                                wordWrap: "anywhere",
                              }}
                              color="text.secondary"
                              value={score.theme.name}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: Colors.grey,
                          p: 1,
                        }}
                      >
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

            {!isEnd && (
              <>
                {Array.from(new Array(3)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                    <SkeletonProfilTheme />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
