import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  AppBar,
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { px } from "csx";
import { useMemo } from "react";
import { BattleGame } from "src/models/BattleGame";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  game: BattleGame;
  open: boolean;
  close: () => void;
}

export const HistoryGameModal = ({ game, open, close }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const totalScore1 = useMemo(
    () => game.games.reduce((acc, value) => acc + value.pointsPlayer1, 0),
    [game]
  );
  const totalScore2 = useMemo(
    () => game.games.reduce((acc, value) => acc + value.pointsPlayer2, 0),
    [game]
  );

  const color1 = useMemo(
    () =>
      game.scoreplayer1 > game.scoreplayer2
        ? Colors.green
        : game.scoreplayer1 < game.scoreplayer2
        ? Colors.red
        : Colors.black,
    [game]
  );

  const color2 = useMemo(
    () =>
      game.scoreplayer2 > game.scoreplayer1
        ? Colors.green
        : game.scoreplayer2 < game.scoreplayer1
        ? Colors.red
        : Colors.black,
    [game]
  );

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      sx={{ backgroundColor: "inherit" }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.gamehistory")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 1, mb: px(50) }}>
        <Grid container spacing={1} flexDirection="column-reverse">
          {game.games.map((el, index) => {
            const colorPlayer1 =
              el.pointsPlayer1 > el.pointsPlayer2
                ? Colors.green
                : el.pointsPlayer1 < el.pointsPlayer2
                ? Colors.red
                : Colors.black;

            const colorPlayer2 =
              el.pointsPlayer2 > el.pointsPlayer1
                ? Colors.green
                : el.pointsPlayer2 < el.pointsPlayer1
                ? Colors.red
                : Colors.black;
            return (
              <Grid key={index} size={12}>
                <Paper variant="outlined" sx={{ p: 1 }}>
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      size={12}>
                      <ImageThemeBlock theme={el.theme} size={40} />
                      <TextNameBlock
                        variant="h4"
                        sx={{ textAlign: "center" }}
                        values={el.theme.themetranslation}
                      />
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                      size={4}>
                      <AvatarAccount
                        avatar={game.player1.avatar.icon}
                        size={30}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          overflow: "hidden",
                          display: "block",
                          lineClamp: 1,
                          boxOrient: "vertical",
                          textOverflow: "ellipsis",
                          color: colorPlayer1,
                        }}
                      >
                        {game.player1.username}
                      </Typography>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                      size={4}>
                      <Typography variant="h2" sx={{ color: colorPlayer1 }}>
                        {el.pointsPlayer1}
                      </Typography>
                      <Typography variant="h4">-</Typography>
                      <Typography variant="h2" sx={{ color: colorPlayer2 }}>
                        {el.pointsPlayer2}
                      </Typography>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                      size={4}>
                      {game.player2 && (
                        <>
                          <Typography
                            variant="h6"
                            sx={{
                              overflow: "hidden",
                              display: "block",
                              lineClamp: 1,
                              boxOrient: "vertical",
                              textOverflow: "ellipsis",
                              color: colorPlayer2,
                            }}
                          >
                            {game.player2.username}
                          </Typography>
                          <AvatarAccount
                            avatar={game.player2.avatar.icon}
                            size={30}
                          />
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
          <Grid
            sx={{
              backgroundColor: "background.paper",
              pb: 2,
              position: "sticky",
              top: 0,
            }}
            size={12}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
                size={2}>
                <AvatarAccount avatar={game.player1.avatar.icon} size={50} />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
                size={8}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h2" sx={{ color: color1 }}>
                    {game.scoreplayer1}
                  </Typography>
                  <Typography variant="h4">-</Typography>
                  <Typography variant="h2" sx={{ color: color2 }}>
                    {game.scoreplayer2}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">
                    {totalScore1} {t("commun.points")}
                  </Typography>
                  <Typography variant="h4">-</Typography>
                  <Typography variant="h6">
                    {totalScore2} {t("commun.points")}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
                size={2}>
                {game.player2 && (
                  <AvatarAccount avatar={game.player2.avatar.icon} size={50} />
                )}
              </Grid>
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
                value={Colors.blue}
                label={t("commun.return")}
                icon={KeyboardReturnIcon}
                onClick={close}
                variant="contained"
              />
            </Box>
          </Container>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
