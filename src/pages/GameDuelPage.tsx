import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px } from "csx";
import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Colors } from "src/style/Colors";

import BoltIcon from "@mui/icons-material/Bolt";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { selectDuelGameById } from "src/api/game";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { ButtonColor } from "src/component/Button";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ProfileTitleBlock } from "src/component/title/ProfileTitle";
import { DuelGame } from "src/models/DuelGame";
import { QuestionResult, QuestionResultV1 } from "src/models/Question";
import { TextNameBlock } from "src/component/language/TextLanguageBlock";

export default function GameDuelPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<undefined | DuelGame>(undefined);
  const [questions, setQuestions] = useState<
    Array<QuestionResult | QuestionResultV1>
  >([]);

  useEffect(() => {
    const getGame = () => {
      if (uuid) {
        selectDuelGameById(uuid).then(({ data }) => {
          setGame(data as DuelGame);
          const questions =
            data.version === 1
              ? (data.questions as Array<QuestionResultV1>)
              : (data.questions as Array<QuestionResult>);

          setQuestions(questions);
        });
      }
    };
    getGame();
  }, [uuid]);

  return (
    <Grid container className="page" alignContent="flex-start">
      <Helmet>
        <title>{`${t("commun.duelgame")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("commun.duelgame")} quit={() => navigate(-1)} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {game && (
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: px(70) }}>
                    <ImageThemeBlock theme={game.theme} />
                  </Box>
                  <TextNameBlock
                    variant="h2"
                    sx={{ wordBreak: "break-all" }}
                    values={game.theme.themetranslation}
                  />
                </Grid>
                <Grid
                  item
                  xs={5}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Typography
                      variant="h2"
                      sx={{ color: Colors.colorDuel1, fontSize: 35 }}
                    >
                      {game.ptsplayer1}
                    </Typography>
                    <AvatarAccountBadge
                      profile={game.player1}
                      size={60}
                      color={Colors.colorDuel1}
                    />
                  </Box>
                  <Box sx={{ textAlign: "end" }}>
                    <Typography variant="h4" sx={{ color: Colors.colorDuel1 }}>
                      {game.player1.username}
                    </Typography>
                    <ProfileTitleBlock
                      titleprofile={game.player1.titleprofile}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BoltIcon sx={{ fontSize: 50, color: Colors.white }} />
                </Grid>
                <Grid
                  item
                  xs={5}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  {game.player2 && (
                    <>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <AvatarAccountBadge
                          profile={game.player2}
                          size={60}
                          color={Colors.colorDuel2}
                        />
                        <Typography
                          variant="h2"
                          sx={{ color: Colors.colorDuel2, fontSize: 35 }}
                        >
                          {game.ptsplayer2}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{ color: Colors.colorDuel2 }}
                        >
                          {game.player2.username}
                        </Typography>
                        <ProfileTitleBlock
                          titleprofile={game.player2.titleprofile}
                        />
                      </Box>
                    </>
                  )}
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
                {[...questions].map((el) => (
                  <Fragment key={el.id}>
                    <Grid item xs={12}>
                      <CardSignalQuestion
                        question={el}
                        version={game.version}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider
                        sx={{
                          borderBottomWidth: 3,
                          borderColor: Colors.white,
                          borderRadius: px(5),
                        }}
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
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
        <Container maxWidth="md">
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
