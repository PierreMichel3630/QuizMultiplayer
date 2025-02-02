import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ButtonColor } from "src/component/Button";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { QuestionResult } from "src/models/Question";
import { Colors } from "src/style/Colors";

import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReplayIcon from "@mui/icons-material/Replay";
import { launchSoloGame, selectSoloGameById } from "src/api/game";
import { BestScoreBlock } from "src/component/BestScoreBlock";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { ReportModal } from "src/component/modal/ReportModal";
import { RankingTableSoloDuel } from "src/component/table/RankingTable";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { SoloGameResult } from "src/models/Game";

export default function RecapSoloPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { uuidGame } = useParams();
  const { uuid } = useUser();
  const { refreshProfil, profile } = useAuth();
  const { getMyAccomplishments } = useApp();

  const [question, setQuestion] = useState<QuestionResult | undefined>(
    undefined
  );
  const [game, setGame] = useState<undefined | SoloGameResult>(undefined);
  const [maxIndex, setMaxIndex] = useState(5);

  const allquestion = location.state ? location.state.allquestion : false;
  const extra = location.state ? location.state.extra : undefined;

  useEffect(() => {
    refreshProfil();
  }, []);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectSoloGameById(uuidGame).then(({ data }) => {
          setGame(data as SoloGameResult);
        });
      }
    };
    getGame();
  }, [uuidGame]);

  const playSolo = () => {
    if (game && uuid) {
      launchSoloGame(uuid, Number(game.theme.id)).then(({ data }) => {
        navigate(`/solo/${data.uuid}`);
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 2);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [maxIndex]);

  const questionsDisplay = useMemo(() => {
    let res: Array<QuestionResult> = [];
    if (game) {
      const start = game.questions.length - maxIndex;
      res = [...game.questions].splice(start, game.questions.length);
    }
    return res;
  }, [game, maxIndex]);

  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 0,
          minHeight: viewHeight(100),
        }}
      >
        <Helmet>
          <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
        </Helmet>

        <Box
          sx={{
            p: 1,
            mb: px(140),
          }}
        >
          {game && (
            <>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <ScoreThemeBlock theme={game.theme} />
                </Grid>
                {allquestion && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      {t("alert.allresponseanswer")}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <MyExperienceSoloBlock
                    xp={extra ? extra.xpplayer1 : undefined}
                  />
                </Grid>
                {profile !== null ? (
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <AddMoneyBlock
                      money={game.points * 10}
                      variant="h4"
                      width={25}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      <Typography variant="body1">
                        <Trans
                          i18nKey={t("alert.notconnect")}
                          values={{
                            link: "Créer un compte",
                            link2: "Se connecter",
                          }}
                          components={{
                            anchor1: <Link to="/login" />,
                            anchor2: <Link to="/register" />,
                          }}
                          style={{ color: "white" }}
                        />
                      </Typography>
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <BestScoreBlock theme={game.theme} points={game.points} />
                </Grid>
                <Grid item xs={12}>
                  <RankingTableSoloDuel
                    theme={game.theme}
                    max={3}
                    mode="SOLO"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1} flexDirection="column-reverse">
                    {questionsDisplay.map((el, index) => (
                      <Fragment key={index}>
                        <Grid item xs={12}>
                          <CardSignalQuestion
                            question={el}
                            report={() => setQuestion(el)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider
                            sx={{
                              borderBottomWidth: 5,
                              borderRadius: px(5),
                            }}
                          />
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <Container
                  maxWidth="md"
                  sx={{
                    backgroundColor: "background.paper",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      p: 1,
                      flexDirection: "column",
                    }}
                  >
                    <ButtonColor
                      value={Colors.red}
                      label={t("commun.tryagain")}
                      icon={ReplayIcon}
                      onClick={() => playSolo()}
                      variant="contained"
                    />
                    <ButtonColor
                      value={Colors.blue}
                      label={t("commun.return")}
                      icon={KeyboardReturnIcon}
                      onClick={() => {
                        getMyAccomplishments();
                        navigate(`/theme/${game.theme.id}`);
                      }}
                      variant="contained"
                    />
                    <ButtonColor
                      value={Colors.green}
                      label={t("commun.returnhome")}
                      icon={HomeIcon}
                      onClick={() => {
                        getMyAccomplishments();
                        navigate("/");
                      }}
                      variant="contained"
                    />
                  </Box>
                </Container>
              </Box>
            </>
          )}
        </Box>
        <ReportModal
          open={question !== undefined}
          close={() => setQuestion(undefined)}
          question={question}
          sologame={game}
        />
      </Container>
    </Box>
  );
}
