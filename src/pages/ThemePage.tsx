import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StarIcon from "@mui/icons-material/Star";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { deleteFavoriteById, insertFavorite } from "src/api/favorite";
import {
  launchDuelGame,
  launchSoloGame,
  matchmakingDuelGame,
} from "src/api/game";
import {
  countPlayersByTheme,
  selectScoreByThemeAndPlayer,
  selectScoresByTheme,
} from "src/api/score";
import { selectThemeById } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { DefaultTabs } from "src/component/Tabs";
import { ProposeQuestionModal } from "src/component/modal/ProposeQuestionModal";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import {
  DataRanking,
  DataRankingMe,
  RankingTable,
} from "src/component/table/RankingTable";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { FavoriteInsert } from "src/models/Favorite";
import { Profile } from "src/models/Profile";
import { Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { getLevel } from "src/utils/calcul";

export default function ThemePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const ITEMPERPAGE = 10;

  const { uuid, language } = useUser();
  const { user, profile } = useAuth();
  const { favorites, refreshFavorites } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [openProposeQuestion, setOpenProposeQuestion] = useState(false);
  const [players, setPlayers] = useState<number | undefined>(undefined);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [loadingTheme, setLoadingTheme] = useState(true);

  const [scores, setScores] = useState<Array<Score>>([]);
  const [loadingScore, setLoadingScore] = useState(true);
  const [myScore, setMyScore] = useState<Score | undefined>(undefined);

  const [tab, setTab] = useState(0);
  const tabs = [
    { label: t("commun.solo") },
    { label: t("commun.duel") },
    { label: t("commun.level") },
  ];

  const favorite = useMemo(
    () => favorites.find((el) => el.theme === Number(id)),
    [id, favorites]
  );

  const dataDuel = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: el.rank,
      })) as Array<DataRanking>,
    [scores]
  );
  const dataMeDuel = useMemo(
    () =>
      myScore && profile
        ? ({
            profile: profile,
            value: myScore.rank,
          } as DataRankingMe)
        : undefined,
    [myScore, profile]
  );

  const dataSolo = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: el.points,
        uuid: el.uuidgame !== null ? el.uuidgame.uuid : undefined,
        extra: t("commun.pointsabbreviation"),
      })) as Array<DataRanking>,
    [scores, t]
  );
  const dataMeSolo = useMemo(
    () =>
      myScore && profile
        ? ({
            profile: profile,
            value: myScore.points,
            extra: t("commun.pointsabbreviation"),
          } as DataRankingMe)
        : undefined,
    [myScore, profile, t]
  );

  const dataLvl = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: getLevel(el.xp),
      })) as Array<DataRanking>,
    [scores]
  );
  const dataMeLvl = useMemo(
    () =>
      myScore && profile
        ? ({
            profile: profile,
            value: getLevel(myScore.xp),
          } as DataRankingMe)
        : undefined,
    [myScore, profile]
  );

  const data = useMemo(() => {
    let res = dataLvl;
    if (tab === 0) {
      res = dataSolo;
    } else if (tab === 1) {
      res = dataDuel;
    }
    return res;
  }, [dataDuel, dataLvl, dataSolo, tab]);

  const dataMe = useMemo(() => {
    let res = dataMeLvl;
    if (tab === 0) {
      res = dataMeSolo;
    } else if (tab === 1) {
      res = dataMeDuel;
    }
    return res;
  }, [dataMeDuel, dataMeLvl, dataMeSolo, tab]);

  useEffect(() => {
    const getPlayers = () => {
      countPlayersByTheme(Number(id)).then(({ count }) => {
        setPlayers(count ? count : undefined);
      });
    };
    const getTheme = () => {
      setLoadingTheme(true);
      if (id) {
        selectThemeById(Number(id)).then((res) => {
          if (res.data) setTheme(res.data as Theme);
          setLoadingTheme(false);
        });
      }
    };
    getTheme();
    getPlayers();
  }, [id]);

  useEffect(() => {
    const getScores = () => {
      if (id) {
        setLoadingScore(true);
        const order = tab === 0 ? "points" : tab === 1 ? "rank" : "xp";
        selectScoresByTheme(Number(id), order, ITEMPERPAGE).then(({ data }) => {
          setScores(data as Array<Score>);
          setLoadingScore(false);
        });
      }
    };
    getScores();
  }, [id, tab]);

  useEffect(() => {
    const getMyRankSolo = () => {
      if (id && uuid) {
        selectScoreByThemeAndPlayer(uuid, Number(id)).then(({ data }) => {
          const res = data as Score;
          setMyScore(res);
        });
      }
    };
    getMyRankSolo();
  }, [id, uuid]);

  const playFriend = async (profile: Profile) => {
    if (profile && id) {
      const { data } = await launchDuelGame(uuid, profile.id, Number(id));
      navigate(`/duel/${data.uuid}`);
    }
  };

  const playDuel = async () => {
    if (user) {
      if (uuid && id) {
        const { data } = await matchmakingDuelGame(uuid, Number(id));
        navigate(`/duel/${data.uuid}`);
      }
    } else {
      navigate(`/login`);
    }
  };

  const playSolo = () => {
    if (uuid && id) {
      launchSoloGame(uuid, Number(id)).then(({ data }) => {
        navigate(`/solo/${data.uuid}`);
      });
    }
  };

  const playTraining = () => {
    if (id) {
      navigate(`/config/training/${id}`);
    }
  };

  const addFavorite = () => {
    if (user) {
      if (theme) {
        if (favorite) {
          deleteFavoriteById(favorite.id).then(({ error }) => {
            if (error) {
              setSeverity("error");
              setMessage(t("commun.error"));
            } else {
              setSeverity("success");
              setMessage(t("alert.deletefavorite"));
              refreshFavorites();
            }
          });
        } else {
          const newFavorite: FavoriteInsert = {
            theme: theme.id,
          };
          insertFavorite(newFavorite).then(({ error }) => {
            if (error) {
              setSeverity("error");
              setMessage(t("commun.error"));
            } else {
              setSeverity("success");
              setMessage(t("alert.addfavorite"));
              refreshFavorites();
            }
          });
        }
      }
    } else {
      navigate(`/login`);
    }
  };

  return (
    <Box sx={{ width: percent(100) }}>
      <Helmet>
        <title>
          {theme
            ? `${theme.name[language.iso]} - ${t("appname")}`
            : t("appname")}
        </title>
      </Helmet>
      <Grid container>
        {loadingTheme ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                p: 1,
                backgroundColor: Colors.black,
              }}
            >
              <Grid
                container
                spacing={1}
                alignItems="center"
                sx={{ zIndex: 10 }}
              >
                <Grid
                  item
                  display={{ xs: "none", sm: "block" }}
                  sm={12}
                  sx={{ textAlign: "center" }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={70}
                    height={20}
                    sx={{ bgcolor: "grey.800" }}
                  />
                </Grid>
                <Grid item xs={3} sm={3} md={2}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={70}
                    sx={{ bgcolor: "grey.800" }}
                  />
                </Grid>
                <Grid
                  item
                  display={{ xs: "block", sm: "none" }}
                  xs={8}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={"70%"}
                    height={35}
                    sx={{ bgcolor: "grey.800" }}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={40}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={40}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={40}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={40}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={40}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ) : (
          <>
            {theme && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    p: 1,
                    backgroundColor: Colors.black,
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid
                      item
                      display={{ xs: "none", sm: "block" }}
                      sm={12}
                      sx={{ textAlign: "center" }}
                    >
                      <JsonLanguageBlock
                        variant="h1"
                        color="text.secondary"
                        value={theme.name}
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={2}>
                      <ImageThemeBlock theme={theme} />
                    </Grid>
                    <Grid
                      item
                      display={{ xs: "block", sm: "none" }}
                      xs={8}
                      sx={{ textAlign: "center" }}
                    >
                      <JsonLanguageBlock
                        variant="h1"
                        color="text.secondary"
                        value={theme.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      {theme.enabled ? (
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <ButtonColor
                              size="small"
                              value={Colors.red}
                              label={t("commun.duel")}
                              icon={OfflineBoltIcon}
                              onClick={() => playDuel()}
                              variant="contained"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <ButtonColor
                              size="small"
                              value={Colors.blue2}
                              label={t("commun.playsolo")}
                              icon={PlayCircleIcon}
                              onClick={() => playSolo()}
                              variant="contained"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <ButtonColor
                              size="small"
                              value={Colors.purple}
                              label={t("commun.training")}
                              icon={FitnessCenterIcon}
                              onClick={() => playTraining()}
                              variant="contained"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <ButtonColor
                              size="small"
                              value={Colors.green}
                              label={t("commun.friendduel")}
                              icon={SupervisedUserCircleRoundedIcon}
                              onClick={() => {
                                if (user) {
                                  setOpenModalFriend(true);
                                } else {
                                  navigate(`/login`);
                                }
                              }}
                              variant="contained"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <ButtonColor
                              size="small"
                              value={
                                favorite ? Colors.greyDarkMode : Colors.yellow
                              }
                              label={
                                favorite
                                  ? t("commun.removefavorite")
                                  : t("commun.addfavorite")
                              }
                              icon={StarIcon}
                              onClick={() => addFavorite()}
                              variant="contained"
                            />
                          </Grid>
                          {user && (
                            <Grid item xs={12}>
                              <ButtonColor
                                size="small"
                                value={Colors.pink2}
                                label={t("commun.proposequestion")}
                                icon={LightbulbIcon}
                                onClick={() => {
                                  if (user) {
                                    setOpenProposeQuestion(true);
                                  } else {
                                    navigate(`/login`);
                                  }
                                }}
                                variant="contained"
                              />
                            </Grid>
                          )}
                        </Grid>
                      ) : (
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Alert severity="error">
                              {t("commun.thememaintenance")}
                            </Alert>
                          </Grid>
                          <Grid item xs={12}>
                            <ButtonColor
                              value={Colors.blue}
                              label={t("commun.return")}
                              icon={KeyboardReturnIcon}
                              onClick={() => navigate(-1)}
                              variant="contained"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <ButtonColor
                              value={Colors.green}
                              label={t("commun.returnhome")}
                              icon={HomeIcon}
                              onClick={() => navigate("/")}
                              variant="contained"
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </>
        )}
        {loadingTheme || theme ? (
          <>
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: Colors.black,
              }}
            >
              <Grid
                container
                justifyContent="center"
                columns={23}
                sx={{
                  borderRadius: px(5),
                }}
              >
                <Grid item xs={7}>
                  <Box sx={{ p: px(2), textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: Colors.lightgrey2,
                        textTransform: "uppercase",
                      }}
                    >
                      {t("commun.mylevel")}
                    </Typography>
                    <Typography variant="h2" color="text.secondary">
                      {myScore ? getLevel(myScore.xp) : "-"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{
                      borderColor: Colors.lightgrey2,
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ p: px(2), textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: Colors.lightgrey2,
                        textTransform: "uppercase",
                      }}
                    >
                      {t("commun.players")}
                    </Typography>
                    <Typography variant="h2" color="text.secondary">
                      {players ? players : "-"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{
                      borderColor: Colors.lightgrey2,
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ p: px(2), textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: Colors.lightgrey2,
                        textTransform: "uppercase",
                      }}
                    >
                      {t("commun.questions")}
                    </Typography>
                    <Typography variant="h2" color="text.secondary">
                      {theme ? theme.questions : "-"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 1 }}>
                <DefaultTabs
                  values={tabs}
                  tab={tab}
                  onChange={(value) => {
                    setLoadingScore(true);
                    setTab(value);
                  }}
                />
                <RankingTable data={data} me={dataMe} loading={loadingScore} />
              </Box>
            </Grid>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              transform: "translate(0%, -50%)",
              top: percent(50),
              width: percent(100),
              p: 2,
            }}
          >
            <Container maxWidth="lg">
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: Colors.lightgrey2,
                      textTransform: "uppercase",
                    }}
                  >
                    {t("alert.pagenotfound")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <ButtonColor
                    value={Colors.blue}
                    label={t("commun.return")}
                    icon={KeyboardReturnIcon}
                    onClick={() => navigate(-1)}
                    variant="contained"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonColor
                    value={Colors.green}
                    label={t("commun.returnhome")}
                    icon={HomeIcon}
                    onClick={() => navigate("/")}
                    variant="contained"
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        )}
      </Grid>
      <SelectFriendModal
        open={openModalFriend}
        close={() => setOpenModalFriend(false)}
        onValid={playFriend}
      />
      {theme && (
        <ProposeQuestionModal
          open={openProposeQuestion}
          close={() => setOpenProposeQuestion(false)}
          theme={theme}
        />
      )}
    </Box>
  );
}
