import { Box, Container, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px, viewHeight } from "csx";
import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Colors } from "src/style/Colors";

import { selectSoloGameById } from "src/api/game";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SoloGame } from "src/models/Game";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { ButtonColor } from "src/component/Button";

export default function GameSoloPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<undefined | SoloGame>(undefined);

  useEffect(() => {
    const getGame = () => {
      if (uuid) {
        selectSoloGameById(uuid).then(({ data }) => {
          setGame(data as SoloGame);
        });
      }
    };
    getGame();
  }, [uuid]);

  return (
    <Grid
      container
      sx={{ backgroundColor: Colors.black, minHeight: viewHeight(100) }}
      alignContent="flex-start"
    >
      <Helmet>
        <title>{`${t("commun.sologame")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("commun.sologame")} quit={() => navigate(-1)} />
      <Grid item xs={12}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {game && (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <ScoreThemeBlock theme={game.theme} score={game.points} />
                  </Grid>
                  {game.questions.map((el, index) => (
                    <Fragment key={index}>
                      <Grid item xs={12}>
                        <CardSignalQuestion question={el} />
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
              </>
            )}
          </Box>
        </Container>
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
              value={Colors.blue}
              label={t("commun.return")}
              icon={KeyboardReturnIcon}
              onClick={() => navigate(-1)}
              variant="contained"
            />
          </Box>
        </Container>
      </Box>
    </Grid>
  );
}
