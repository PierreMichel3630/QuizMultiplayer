import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { Colors } from "src/style/Colors";

import HomeIcon from "@mui/icons-material/Home";
import BoltIcon from "@mui/icons-material/Bolt";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { px } from "csx";
import { useNavigate } from "react-router-dom";

interface Props {
  game: DuelGame;
}

export const EndDuelGameBlock = ({ game }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uuid } = useUser();

  const isPlayer1 = game.player1.id === uuid;
  const hasWin = isPlayer1
    ? game.ptsplayer1 > game.ptsplayer2
    : game.ptsplayer2 > game.ptsplayer1;
  const equality = game.ptsplayer2 === game.ptsplayer1;
  const colorPlayer1 = equality
    ? Colors.white
    : game.ptsplayer1 > game.ptsplayer2
    ? Colors.green
    : Colors.red;
  const colorPlayer2 = equality
    ? Colors.white
    : game.ptsplayer2 > game.ptsplayer1
    ? Colors.green
    : Colors.red;

  return (
    <Box sx={{ pt: 3, pr: 1, pl: 1 }}>
      <Paper sx={{ p: 1 }}>
        <Grid container spacing={2}>
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
            <JsonLanguageBlock
              variant="h2"
              sx={{ wordBreak: "break-all" }}
              value={game.theme.name}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              variant="h1"
              sx={{
                color: equality
                  ? Colors.white
                  : hasWin
                  ? Colors.green
                  : Colors.red,
              }}
            >
              {equality
                ? t("commun.equality")
                : hasWin
                ? t("commun.win")
                : t("commun.loose")}
            </Typography>
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
                sx={{ color: colorPlayer1, fontSize: 35 }}
              >
                {game.ptsplayer1}
              </Typography>
              <AvatarAccount
                avatar={game.player1.avatar}
                size={80}
                color={colorPlayer1}
              />
            </Box>
            <Typography variant="h4" sx={{ color: colorPlayer1 }}>
              {game.player1.username}
            </Typography>
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
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <AvatarAccount
                avatar={game.player2.avatar}
                size={80}
                color={colorPlayer2}
              />
              <Typography
                variant="h2"
                sx={{ color: colorPlayer2, fontSize: 35 }}
              >
                {game.ptsplayer2}
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: colorPlayer2 }}>
              {game.player2.username}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              fullWidth
              startIcon={<HomeIcon color="secondary" />}
            >
              <Typography variant="h2" color="text.primary">
                {t("commun.returnhome")}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
