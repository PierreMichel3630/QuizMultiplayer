import { Alert, Box, Container, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ButtonColor } from "src/component/Button";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Question } from "src/models/Question";
import { Colors } from "src/style/Colors";

import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReplayIcon from "@mui/icons-material/Replay";
import { launchSoloGame, selectSoloGameById } from "src/api/game";
import { ExperienceSoloBlock } from "src/component/ExperienceBlock";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { ReportModal } from "src/component/modal/ReportModal";
import { useUser } from "src/context/UserProvider";
import { SoloGame } from "src/models/Game";

export default function RecapSoloPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { uuidGame } = useParams();
  const { uuid } = useUser();

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [game, setGame] = useState<undefined | SoloGame>(undefined);

  const allquestion = location.state ? location.state.allquestion : false;
  const extra = location.state ? location.state.extra : undefined;

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectSoloGameById(uuidGame).then(({ data }) => {
          setGame(data as SoloGame);
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

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.black,
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
                <ScoreThemeBlock theme={game.theme} score={game.points} />
              </Grid>
              {allquestion && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    {t("alert.allresponseanswer")}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <ExperienceSoloBlock
                  theme={game.theme.id}
                  xp={extra ? extra.xpplayer1 : undefined}
                  player={game.player}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider
                  sx={{
                    borderBottomWidth: 5,
                    borderColor: Colors.white,
                    borderRadius: px(5),
                  }}
                />
              </Grid>
              {game.questions.map((el, index) => (
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
                        borderColor: Colors.white,
                        borderRadius: px(5),
                      }}
                    />
                  </Grid>
                </Fragment>
              ))}
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
                maxWidth="lg"
                sx={{
                  backgroundColor: Colors.black,
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
                    onClick={() => navigate(`/theme/${game.theme.id}`)}
                    variant="contained"
                  />
                  <ButtonColor
                    value={Colors.green}
                    label={t("commun.returnhome")}
                    icon={HomeIcon}
                    onClick={() => navigate("/")}
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
  );
}
