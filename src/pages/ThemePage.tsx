import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StarIcon from "@mui/icons-material/Star";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { deleteFavoriteById, insertFavorite } from "src/api/favorite";
import {
  launchDuelGame,
  launchSoloGame,
  launchTrainingGame,
  matchmakingDuelGame,
} from "src/api/game";
import { selectRankByTheme, selectRankByThemeAndPlayer } from "src/api/rank";
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
import { MyRank, Rank } from "src/models/Rank";
import { MyScore, Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { ProposeQuestionModal } from "src/component/modal/ProposeQuestionModal";

export const ThemePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { uuid, language } = useUser();
  const { user, profile } = useAuth();
  const { favorites, refreshFavorites } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [openProposeQuestion, setOpenProposeQuestion] = useState(false);
  const [players, setPlayers] = useState<number | undefined>(undefined);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  const [ranks, setRanks] = useState<Array<Rank>>([]);
  const [myRank, setMyRank] = useState<MyRank | undefined>(undefined);
  const [scores, setScores] = useState<Array<Score>>([]);
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);

  const [tab, setTab] = useState(0);
  const tabs = [{ label: t("commun.solo") }, { label: t("commun.duel") }];

  const favorite = useMemo(
    () => favorites.find((el) => el.theme === Number(id)),
    [id, favorites]
  );

  const dataDuel = useMemo(
    () =>
      ranks.map((el) => ({
        profile: el.profile,
        value: el.points,
      })) as Array<DataRanking>,
    [ranks]
  );
  const dataMeDuel = useMemo(
    () =>
      myRank && profile
        ? ({
            profile: profile,
            value: myRank.points,
            rank: myRank.rank,
          } as DataRankingMe)
        : undefined,
    [myRank, profile]
  );

  const dataSolo = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: el.points,
      })) as Array<DataRanking>,
    [scores]
  );
  const dataMeSolo = useMemo(
    () =>
      myScore && profile
        ? ({
            profile: profile,
            value: myScore.points,
            rank: myScore.rank,
          } as DataRankingMe)
        : undefined,
    [myScore, profile]
  );

  useEffect(() => {
    const getPlayers = () => {
      countPlayersByTheme(Number(id)).then(({ count }) => {
        setPlayers(count ? count : undefined);
      });
    };
    const getTheme = () => {
      if (id) {
        selectThemeById(Number(id)).then((res) => {
          if (res.data) setTheme(res.data as Theme);
        });
      }
    };
    getTheme();
    getPlayers();
  }, [id]);

  useEffect(() => {
    const getScores = () => {
      if (id) {
        selectScoresByTheme(Number(id), "points").then(({ data }) => {
          setScores(data as Array<Score>);
        });
      }
    };
    const getScoresDuel = () => {
      if (id) {
        selectRankByTheme(Number(id)).then(({ data }) => {
          setRanks(data as Array<Rank>);
        });
      }
    };
    getScoresDuel();
    getScores();
  }, [id]);

  useEffect(() => {
    const getMyRankSolo = () => {
      if (id && uuid) {
        selectScoreByThemeAndPlayer(uuid, Number(id)).then(({ data }) => {
          const res = data as MyScore;
          setMyScore(res.id !== null ? res : undefined);
        });
      }
    };
    const getMyRankDuel = () => {
      if (id && uuid) {
        selectRankByThemeAndPlayer(uuid, Number(id)).then(({ data }) => {
          const res = data as MyRank;
          setMyRank(res.id !== null ? res : undefined);
        });
      }
    };
    getMyRankSolo();
    getMyRankDuel();
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
    if (uuid && id) {
      launchTrainingGame(uuid, Number(id)).then(({ data }) => {
        navigate(`/training/${data.uuid}`);
      });
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
        {theme && (
          <Grid item xs={12}>
            <Box
              sx={
                theme.background
                  ? {
                      backgroundImage: theme.background
                        ? `url(${theme.background})`
                        : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      p: 1,
                      display: "flex",
                    }
                  : {
                      display: "flex",
                      p: 1,
                      backgroundColor: Colors.grey2,
                    }
              }
            >
              <Grid container spacing={1} alignItems="center">
                <Grid
                  item
                  display={{ xs: "none", sm: "block" }}
                  sm={12}
                  sx={{ textAlign: "center" }}
                >
                  <JsonLanguageBlock
                    variant="h2"
                    sx={{
                      color: Colors.white,
                      textShadow: "2px 2px 4px black",
                      fontSize: 35,
                    }}
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
                    variant="h2"
                    sx={{
                      color: Colors.white,
                      textShadow: "2px 2px 4px black",
                    }}
                    value={theme.name}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
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
                        value={favorite ? Colors.greyDarkMode : Colors.yellow}
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
                          value={Colors.pink}
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
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            columns={23}
            sx={{
              background: "rgba(255,255,255,.15)",
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
                  {t("commun.games")}
                </Typography>
                <Typography variant="h2">
                  {myScore ? myScore.games + myScore.duelgames : "-"}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Divider orientation="vertical" variant="middle" flexItem />
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
                <Typography variant="h2">{players ? players : "-"}</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Divider orientation="vertical" variant="middle" flexItem />
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
                <Typography variant="h2">
                  {theme ? theme.questions : "-"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 1 }}>
            <DefaultTabs values={tabs} tab={tab} onChange={setTab} />
            <RankingTable
              data={tab === 0 ? dataSolo : dataDuel}
              me={tab === 0 ? dataMeSolo : dataMeDuel}
            />
          </Box>
        </Grid>
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
};
