import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";
import { HistoryGame, HistoryGameAdmin } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { ThemeNameBlock } from "../theme/ThemeBlock";

interface Props {
  game: HistoryGame;
}

export const CardHistoryGame = ({ game }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const isSolo = useMemo(() => game.type === "SOLO", [game.type]);
  const isPlayer1 = useMemo(
    () => profile && game.player1.id === profile.id,
    [game, profile]
  );
  const win = useMemo(() => {
    const eq = game.ptsplayer1 === game.ptsplayer2;
    const hasWin = isPlayer1
      ? game.ptsplayer1 > (game.ptsplayer2 ?? 0)
      : (game.ptsplayer2 ?? 0) > game.ptsplayer1;
    return eq ? 0.5 : hasWin ? 1 : 0;
  }, [game, isPlayer1]);

  const color = useMemo(
    () =>
      win === 0.5 ? "text.primary" : win === 1 ? Colors.green : Colors.red,
    [win]
  );

  return (
    <Paper sx={{ p: px(5) }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2} md={1}>
          <ImageThemeBlock theme={game.theme} />
        </Grid>
        {isSolo ? (
          <>
            <Grid item xs={7} md={8}>
              <Link
                to={`/theme/${game.theme.id}`}
                style={{ textDecoration: "none" }}
              >
                <ThemeNameBlock theme={game.theme} variant="h4" />
              </Link>
              <Typography variant="caption">
                {moment(game.created_at).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: px(3),
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="h2">{game.ptsplayer1}</Typography>
                  <Typography variant="body1">
                    {t("commun.pointsabbreviation")}
                  </Typography>
                </Box>
                <Link to={`/game/solo/${game.uuid}`} style={{ height: px(20) }}>
                  <VisibilityIcon fontSize="small" />
                </Link>
              </Box>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs>
              <Link
                to={`/theme/${game.theme.id}`}
                style={{ textDecoration: "none" }}
              >
                <ThemeNameBlock theme={game.theme} variant="h4" />
              </Link>
              <Typography variant="caption">
                {moment(game.created_at).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Link
                to={`/profil/${
                  isPlayer1 && game.player2 ? game.player2.id : game.player1.id
                }`}
                style={{ textDecoration: "none" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: px(3) }}>
                  <Typography variant="body1">{t("commun.versus")}</Typography>
                  <Typography variant="h6">
                    {isPlayer1 && game.player2
                      ? game.player2.username
                      : game.player1.username}
                  </Typography>
                </Box>
              </Link>
            </Grid>
            <Grid
              item
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: color }}>
                  {win === 0.5
                    ? t("commun.draw")
                    : win === 1
                    ? t("commun.victory")
                    : t("commun.defeat")}
                </Typography>
                <Typography variant="h4" sx={{ color: color }}>
                  {isPlayer1
                    ? `${game.ptsplayer1} - ${game.ptsplayer2}`
                    : `${game.ptsplayer2} - ${game.ptsplayer1}`}
                </Typography>
              </Box>
              <Link to={`/game/duel/${game.uuid}`} style={{ height: px(20) }}>
                <VisibilityIcon fontSize="small" />
              </Link>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

interface PropsAdmin {
  game: HistoryGameAdmin;
}

export const CardHistoryGameAdmin = ({ game }: PropsAdmin) => {
  const { t } = useTranslation();

  const isSolo = useMemo(() => game.type === "SOLO", [game.type]);

  return (
    <Paper sx={{ p: px(5) }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2} md={1}>
          <ImageThemeBlock theme={game.theme} />
        </Grid>
        <Grid item xs={10} md={11}>
          <Grid container spacing={1} alignItems="center">
            {isSolo ? (
              <>
                <Grid item xs={10}>
                  <Typography variant="h2" noWrap>
                    {game.theme.title}
                  </Typography>
                  <Typography variant="caption">
                    {moment(game.created_at).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Typography variant="h6">
                    {game.player1 !== null
                      ? game.player1.username
                      : "NON CONNECTÉ"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: px(3),
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h2">{game.ptsplayer1}</Typography>
                    <Typography variant="body1">
                      {t("commun.pointsabbreviation")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Link
                    to={`/game/solo/${game.uuid}`}
                    style={{ height: px(20) }}
                  >
                    <VisibilityIcon />
                  </Link>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={10}>
                  <Typography variant="h2" noWrap>
                    {game.theme.title}
                  </Typography>
                  <Typography variant="caption">
                    {moment(game.created_at).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: px(3) }}
                  >
                    <Typography variant="h6">
                      {`${
                        game.player1 !== null
                          ? game.player1.username
                          : "NON CONNECTÉ"
                      } ${t("commun.versus")} ${
                        game.player2 ? game.player2.username : "inconnu"
                      }`}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: px(3) }}
                  >
                    <Typography variant="h2">
                      {`${game.ptsplayer1} - ${game.ptsplayer2}`}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Link
                    to={`/game/duel/${game.uuid}`}
                    style={{ height: px(20) }}
                  >
                    <VisibilityIcon />
                  </Link>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
