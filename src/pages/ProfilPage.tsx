import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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
  selectScoresByProfilePaginate,
} from "src/api/score";
import { selectTitleByProfile } from "src/api/title";
import { BarVictory } from "src/component/chart/BarVictory";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Opposition, Score } from "src/models/Score";
import { TitleProfile } from "src/models/Title";
import { sortByUsername } from "src/utils/sort";

import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectFriendByProfileId } from "src/api/friend";
import { BasicSearchInput } from "src/component/Input";
import { ProfileAction } from "src/component/ProfileAction";
import { SortButton } from "src/component/SortBlock";
import { StatusProfileBlock } from "src/component/StatusProfileBlock";
import { CardBadge } from "src/component/card/CardBadge";
import { CardChallenge } from "src/component/card/CardChallenge";
import { CardFinishTheme } from "src/component/card/CardFinishTheme";
import { CardFriends } from "src/component/card/CardFriends";
import { CardOpposition } from "src/component/card/CardOpposition";
import { CardTitle } from "src/component/card/CardTitle";
import { SkeletonAvatarPlayer } from "src/component/skeleton/SkeletonPlayer";
import { SkeletonProfilTheme } from "src/component/skeleton/SkeletonTheme";
import { ThemeTitleBlock } from "src/component/theme/ThemeBlock";
import { ProfileTitleBlock } from "src/component/title/ProfileTitle";
import { useApp } from "src/context/AppProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Friend, FRIENDSTATUS } from "src/models/Friend";
import { getLevel } from "src/utils/calcul";
import HistoryIcon from "@mui/icons-material/History";
import { ButtonColor } from "src/component/Button";
import { ShopItems } from "src/component/ShopBlock";
import { useAppBar } from "src/context/AppBarProvider";

export default function ProfilPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid } = useUser();
  const { user, profile } = useAuth();
  const { friends } = useApp();
  const { top } = useAppBar();
  const navigate = useNavigate();

  const ITEMPERPAGE = 25;

  const [profileUser, setProfileUser] = useState<Profile | undefined>(
    undefined
  );
  const [scores, setScores] = useState<Array<Score>>([]);
  const [titles, setTitles] = useState<Array<TitleProfile>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [oppositions, setOppositions] = useState<Array<Opposition>>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("games");
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [profileFriends, setProfileFriends] = useState<Array<Friend>>([]);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [isLoadingTitle, setIsLoadingTitle] = useState(true);
  const [isLoadingBadge, setIsLoadingBadge] = useState(true);
  const [isLoadingOppositions, setIsLoadingOppositions] = useState(true);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [, setPage] = useState(0);

  const [isEnd, setIsEnd] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

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
    { value: "games", label: t("sort.gamessolo"), sort: setSort },
    { value: "duelgames", label: t("sort.gamesduel"), sort: setSort },
    { value: "points", label: t("sort.scoresolo"), sort: setSort },
    { value: "rank", label: t("sort.scoreduel"), sort: setSort },
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

  const getScore = useCallback(
    (page: number) => {
      if (isLoadingScore) return;
      if (!isEnd && id) {
        setIsLoadingScore(true);
        selectScoresByProfilePaginate(id, sort, page, ITEMPERPAGE).then(
          ({ data }) => {
            const res = data as Array<Score>;
            setScores((prev) => (page === 0 ? [...res] : [...prev, ...res]));
            setIsEnd(res.length < ITEMPERPAGE);
            setIsLoadingScore(false);
          }
        );
      }
    },
    [id, isEnd, isLoadingScore, sort]
  );

  useEffect(() => {
    setPage(0);
    setScores([]);
    setIsEnd(false);
    getScore(0);
  }, [sort, id]);

  useEffect(() => {
    if (isLoadingScore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getScore(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [scores, isLoadingScore, isEnd, getScore]);

  useEffect(() => {
    const getTitles = () => {
      setIsLoadingTitle(true);
      if (id) {
        selectTitleByProfile(id).then(({ data }) => {
          setTitles(data ?? []);
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

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

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
        )
        .sort(sortByUsername),
    [profileFriends, id]
  );

  const goPersonalized = () => {
    if (profile) {
      navigate(`/personalized`);
    }
  };

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
          backgroundColor: Colors.colorApp,
          backgroundImage: profileUser?.banner
            ? `url("${profileUser.banner.src}")`
            : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.colorApp} 46%, ${Colors.blue} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          cursor: isMe ? "pointer" : "cursor",
        }}
        onClick={goPersonalized}
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid sx={{ mb: 1 }}>
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
                sx={{
                  textAlign: "center",
                }}
                size={12}
              >
                <Typography
                  variant="h2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    display: "block",
                    lineClamp: 1,
                    boxOrient: "vertical",
                    textOverflow: "ellipsis",
                    textShadow: "1px 1px 2px black",
                  }}
                >
                  {profileUser.username}
                </Typography>
                <ProfileTitleBlock titleprofile={profileUser.titleprofile} />
              </Grid>
              {!isMe && friend && (
                <Grid
                  sx={{ display: "flex", justifyContent: "center" }}
                  size={12}
                >
                  <StatusProfileBlock
                    online={profileUser.isonline}
                    color="text.secondary"
                  />
                </Grid>
              )}
              {profileUser.country && (
                <Grid
                  sx={{ display: "flex", justifyContent: "center" }}
                  size={12}
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
          <Grid size={12}>
            {isMe ? <ShopItems /> : <ProfileAction profileUser={profileUser} />}
          </Grid>
          <Grid size={12}>
            <CardChallenge profileId={id} />
          </Grid>

          <Grid size={12}>
            <CardBadge badges={badges} loading={isLoadingBadge} />
          </Grid>
          <Grid size={12}>
            <CardTitle titles={titles} loading={isLoadingTitle} />
          </Grid>
          <Grid size={12}>
            <CardFriends friends={friendsAvatar} loading={isLoadingFriends} />
          </Grid>
          {profileUser && (
            <Grid size={12}>
              <CardFinishTheme profile={profileUser} />
            </Grid>
          )}
          {profileUser && totalOpposition.games > 0 && (
            <Grid size={12}>
              <CardOpposition
                opposition={totalOpposition}
                opponent={profileUser}
                loading={isLoadingOppositions}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: px(5),
            p: 1,
            position: "sticky",
            top: top,
            transition: "top 350ms ease-in-out",
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
        {isMe && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: px(5),
              p: 1,
              zIndex: 5,
            }}
          >
            <ButtonColor
              value={Colors.blue2}
              label={t("commun.gamehistory")}
              icon={HistoryIcon}
              variant="contained"
              onClick={() =>
                navigate(`/games`, {
                  state: {
                    player: profile,
                    type: "solo",
                  },
                })
              }
            />
          </Box>
        )}
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {scores.map((score, index) => {
              return (
                <Grid
                  key={score.id}
                  ref={index === scores.length - 1 ? lastItemRef : null}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 4,
                  }}
                >
                  <Paper
                    sx={{
                      overflow: "hidden",
                      height: percent(100),
                    }}
                  >
                    <Grid container>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: Colors.colorApp,
                          p: px(5),
                          justifyContent: "space-between",
                        }}
                        size={12}
                      >
                        <ThemeTitleBlock theme={score.theme} />
                      </Grid>
                      <Grid
                        sx={{
                          backgroundColor: Colors.grey,
                          p: 1,
                        }}
                        size={12}
                      >
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          {score && score.duelgames > 0 && (
                            <>
                              <Grid size={12}>
                                <Typography variant="h4" component="span">
                                  {t("commun.duel")}
                                </Typography>
                              </Grid>
                              <Grid sx={{ textAlign: "center" }} size={6}>
                                <Typography variant="body1" component="span">
                                  {t("commun.games")} {" : "}
                                </Typography>
                                <Typography variant="h4" component="span">
                                  {score ? score.duelgames : "0"}
                                </Typography>
                              </Grid>
                              <Grid sx={{ textAlign: "center" }} size={6}>
                                <Typography variant="body1" component="span">
                                  {t("commun.points")} {" : "}
                                </Typography>
                                <Typography variant="h4" component="span">
                                  {score.rank}
                                </Typography>
                              </Grid>
                              <Grid size={12}>
                                <BarVictory
                                  victory={score.victory}
                                  draw={score.draw}
                                  defeat={score.defeat}
                                />
                              </Grid>
                            </>
                          )}
                          {score && score.games > 0 && (
                            <>
                              <Grid size={12}>
                                <Grid
                                  container
                                  spacing={1}
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Grid size={12}>
                                    <Typography variant="h4" component="span">
                                      {t("commun.solo")}
                                    </Typography>
                                  </Grid>
                                  <Grid sx={{ textAlign: "center" }} size={6}>
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
                                  <Grid sx={{ textAlign: "center" }} size={6}>
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

            {!isEnd ? (
              <>
                {Array.from(new Array(3)).map((_, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 6,
                      lg: 4,
                    }}
                  >
                    <SkeletonProfilTheme />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {!isLoadingScore && scores.length === 0 && (
                  <Grid size={12}>
                    <Alert severity="warning">{t("commun.noresultgame")}</Alert>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
