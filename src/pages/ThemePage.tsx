import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
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

export const ThemePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { uuid } = useUser();
  const navigate = useNavigate();

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
  }, [id, tab, types]);

  useEffect(() => {
    const getMyRank = () => {
      if (id) {
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

  return (
    <Grid container spacing={1}>
      {theme && (
        <>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <JsonLanguageBlock variant="h1" value={theme.name} />
          </Grid>
          <Grid item xs={5} sm={3} md={3}>
            <ImageThemeBlock theme={theme} />
          </Grid>
          <Grid item xs={7} sm={9} md={9}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ p: 1 }}
                  onClick={() => playSolo()}
                  fullWidth
                >
                  <Typography variant="h4">{t("commun.playsolo")}</Typography>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ p: 1 }}
                  onClick={() => playSolo()}
                  fullWidth
                >
                  <Typography variant="h4">{t("commun.duel")}</Typography>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ p: 1 }}
                  onClick={() => playSolo()}
                  fullWidth
                >
                  <Typography variant="h4">{t("commun.friendduel")}</Typography>
                </Button>
              </Grid>
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
      <Grid item xs={12}></Grid>
    </Grid>
  );
};
