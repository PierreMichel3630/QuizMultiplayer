import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
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
import { countPlayersByTheme } from "src/api/score";
import { selectThemeById } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { InfoBlock } from "src/component/InfoBlock";
import { ProposeQuestionModal } from "src/component/modal/ProposeQuestionModal";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { RankingTableSoloDuelPaginate } from "src/component/table/RankingTable";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { FavoriteInsert } from "src/models/Favorite";
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";

export default function ThemePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { uuid } = useUser();
  const { user, profile } = useAuth();
  const { favorites, getFavorite } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [openProposeQuestion, setOpenProposeQuestion] = useState(false);
  const [players, setPlayers] = useState<number | undefined>(undefined);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [loadingTheme, setLoadingTheme] = useState(true);

  const favorite = useMemo(
    () => favorites.find((el) => el.theme === Number(id)),
    [id, favorites]
  );

  useEffect(() => {
    const getPlayers = () => {
      countPlayersByTheme(Number(id)).then(({ count }) => {
        setPlayers(count ?? undefined);
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
              getFavorite();
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
              getFavorite();
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
          {theme ? `${theme.title} - ${t("appname")}` : t("appname")}
        </title>
        {theme && (
          <meta
            name="description"
            content={`${t("appname")} Quiz ${theme.title}`}
          />
        )}
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
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={25}
                    sx={{ bgcolor: "grey.800" }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={150}
                    sx={{ bgcolor: "grey.800" }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={35}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={35}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={35}
                        sx={{ bgcolor: "grey.800" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={35}
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
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={12}>
                      <TitleBlock
                        title={theme.title}
                        addFavorite={addFavorite}
                        favorite={favorite !== undefined}
                      />
                    </Grid>
                    {!theme.enabled && (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          {t("commun.thememaintenance")}
                        </Alert>
                      </Grid>
                    )}
                    {!theme.validate && (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          {t("commun.themenotvalidate")}
                        </Alert>
                      </Grid>
                    )}
                    <Grid item xs={5} sm={3} md={3} lg={3}>
                      <ImageThemeBlock theme={theme} />
                    </Grid>
                    <Grid item xs={7} sm={6} md={6} lg={6}>
                      <Grid container spacing={1}>
                        {((theme.enabled && theme.validate) ||
                          profile?.isadmin) && (
                          <>
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
                          </>
                        )}
                        {/*
                        <Grid item xs={12}>
                          <ButtonColor
                            size="small"
                            value={Colors.pink}
                            label={t("commun.proposequestion")}
                            icon={QuestionMarkIcon}
                            onClick={() => setOpenProposeQuestion(true)}
                            variant="contained"
                          />
                        </Grid>*/}
                        {(!theme.enabled || !theme.validate) && (
                          <Grid item xs={12}>
                            <ButtonColor
                              value={Colors.blue}
                              label={t("commun.return")}
                              icon={KeyboardReturnIcon}
                              onClick={() => navigate(-1)}
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
          </>
        )}
        {loadingTheme || theme ? (
          <>
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="center"
                columns={13}
                sx={{
                  borderRadius: px(5),
                }}
              >
                <Grid item xs={6}>
                  <InfoBlock
                    title={t("commun.players")}
                    value={players ?? "-"}
                  />
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
                      borderColor: Colors.grey5,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoBlock
                    title={t("commun.questions")}
                    value={theme ? theme.questions : "-"}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <RankingTableSoloDuelPaginate theme={theme} />
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
            <Container maxWidth="md">
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
