import {
  AppBar,
  Box,
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
import { useMemo } from "react";
import { BattleGame } from "src/models/BattleGame";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { AvatarAccount } from "../avatar/AvatarAccount";

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
      <DialogContent sx={{ p: 1 }}>
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
              <Grid item xs={12} key={index}>
                <Paper variant="outlined" sx={{ p: 1 }}>
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ImageThemeBlock theme={el.theme} size={40} />
                      <JsonLanguageBlock
                        variant="h4"
                        sx={{ textAlign: "center" }}
                        value={el.theme.name}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
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
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="h2" sx={{ color: colorPlayer1 }}>
                        {el.pointsPlayer1}
                      </Typography>
                      <Typography variant="h4">-</Typography>
                      <Typography variant="h2" sx={{ color: colorPlayer2 }}>
                        {el.pointsPlayer2}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
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
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <AvatarAccount avatar={game.player1.avatar.icon} size={50} />
              </Grid>
              <Grid
                item
                xs={8}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
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
                item
                xs={2}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <AvatarAccount avatar={game.player2.avatar.icon} size={50} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
