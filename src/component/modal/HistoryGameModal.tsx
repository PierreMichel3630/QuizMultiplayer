import {
  AppBar,
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
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { AvatarAccount } from "../avatar/AvatarAccount";

interface Props {
  games: Array<{ theme: Theme; pointsPlayer1: number; pointsPlayer2: number }>;
  player1: Profile;
  player2: Profile;
  open: boolean;
  close: () => void;
}

export const HistoryGameModal = ({
  games,
  player1,
  player2,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
          {games.map((game, index) => {
            const colorPlayer1 =
              game.pointsPlayer1 > game.pointsPlayer2
                ? Colors.green
                : game.pointsPlayer1 < game.pointsPlayer2
                ? Colors.red
                : Colors.black;

            const colorPlayer2 =
              game.pointsPlayer2 > game.pointsPlayer1
                ? Colors.green
                : game.pointsPlayer2 < game.pointsPlayer1
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
                      <ImageThemeBlock theme={game.theme} size={40} />
                      <JsonLanguageBlock
                        variant="h4"
                        sx={{ textAlign: "center" }}
                        value={game.theme.name}
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
                      <AvatarAccount avatar={player1.avatar.icon} size={30} />
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
                        {player1.username}
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
                        {game.pointsPlayer1}
                      </Typography>
                      <Typography variant="h4">-</Typography>
                      <Typography variant="h2" sx={{ color: colorPlayer2 }}>
                        {game.pointsPlayer2}
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
                        {player2.username}
                      </Typography>
                      <AvatarAccount avatar={player2.avatar.icon} size={30} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
