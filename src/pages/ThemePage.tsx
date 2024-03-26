import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { important, percent, px } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectScoreByThemeAndPlayer,
  selectScoresByTheme,
} from "src/api/score";
import { selectThemeById } from "src/api/theme";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { DefaultTabs } from "src/component/Tabs";
import { RankingTable } from "src/component/table/RankingTable";
import { useUser } from "src/context/UserProvider";
import { MyScore, Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import { launchDuelGame } from "src/api/game";
import { useAuth } from "src/context/AuthProviderSupabase";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";

export const ThemePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [scores, setScore] = useState<Array<Score>>([]);
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  const [tab, setTab] = useState(0);
  const tabs = [t("commun.solo"), t("commun.duel"), t("commun.games")];
  const types: Array<"points" | "games"> = ["points", "points", "games"];

  useEffect(() => {
    const getTheme = () => {
      if (id) {
        selectThemeById(Number(id)).then((res) => {
          if (res.data) setTheme(res.data as Theme);
        });
      }
    };
    getTheme();
  }, [id]);

  useEffect(() => {
    const getScores = () => {
      if (id) {
        selectScoresByTheme(Number(id), types[tab]).then(({ data }) => {
          setScore(data as Array<Score>);
        });
      }
    };
    getScores();
  }, [id, types[tab]]);

  useEffect(() => {
    const getMyRank = () => {
      if (id && uuid) {
        selectScoreByThemeAndPlayer(uuid, Number(id)).then(({ data }) => {
          const res = data as MyScore;
          setMyScore(res.id !== null ? res : undefined);
        });
      }
    };
    getMyRank();
  }, [id, uuid]);

  const playSolo = () => {
    navigate(`/solo/${id}`);
  };

  const playFriend = async (uuidFriend: string) => {
    if (uuidFriend && id) {
      const { data } = await launchDuelGame(uuid, uuidFriend, Number(id));
      navigate(`/duel/${data.uuid}`);
    }
  };

  return (
    <Box sx={{ width: percent(100) }}>
      <Grid container spacing={1} alignItems="center">
        {theme && (
          <>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <JsonLanguageBlock variant="h1" value={theme.name} />
            </Grid>
            <Grid item xs={5} sm={3} md={2}>
              <ImageThemeBlock theme={theme} />
            </Grid>
            <Grid item xs={7} sm={9} md={10}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => playSolo()}
                    fullWidth
                    startIcon={
                      <PlayCircleIcon
                        sx={{ color: Colors.red, fontSize: important(px(25)) }}
                      />
                    }
                  >
                    <Typography variant="h4" sx={{ color: Colors.red }}>
                      {t("commun.playsolo")}
                    </Typography>
                  </Button>
                </Grid>
                {user && (
                  <>
                    {/*<Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => playDuel()}
                        fullWidth
                        startIcon={
                          <img src={SwordIcon} width={25} height={25} />
                        }
                      >
                        <Typography variant="h4" sx={{ color: Colors.blue2 }}>
                          {t("commun.duel")}
                        </Typography>
                      </Button>
                      </Grid>*/}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenModalFriend(true)}
                        fullWidth
                        startIcon={
                          <SupervisedUserCircleRoundedIcon
                            sx={{
                              color: Colors.green,
                              fontSize: important(px(25)),
                            }}
                          />
                        }
                      >
                        <Typography variant="h4" sx={{ color: Colors.green }}>
                          {t("commun.friendduel")}
                        </Typography>
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
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
                      {myScore ? myScore.games : "-"}
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
                    <Typography variant="h2">-</Typography>
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
                    <Typography variant="h2">{theme.questions}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <DefaultTabs values={tabs} tab={tab} onChange={setTab} />
          <RankingTable scores={scores} myscore={myScore} type={types[tab]} />
        </Grid>
      </Grid>
      <SelectFriendModal
        open={openModalFriend}
        close={() => setOpenModalFriend(false)}
        onValid={playFriend}
      />
    </Box>
  );
};
