import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HistoryGame } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { Profile } from "src/models/Profile";

interface Props {
  game: HistoryGame;
  player?: Profile;
}

export const CardHistoryGame = ({ game, player }: Props) => {
  const { t } = useTranslation();

  const isSolo = useMemo(() => game.type === "SOLO", [game.type]);
  const isPlayer1 = useMemo(
    () => player && game.player1.id === player.id,
    [game, player]
  );
  const win = useMemo(() => {
    const eq = game.ptsplayer1 === game.ptsplayer2;
    const hasWin = isPlayer1
      ? game.ptsplayer1 > (game.ptsplayer2 ?? 0)
      : (game.ptsplayer2 ?? 0) > game.ptsplayer1;
    return eq ? 0.5 : hasWin ? 1 : 0;
  }, [game, isPlayer1]);

  const color = useMemo(
    () => (win === 0.5 ? Colors.black : win === 1 ? Colors.green : Colors.red),
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
              <JsonLanguageBlock variant="h2" value={game.theme.name} noWrap />
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
                  <VisibilityIcon
                    fontSize="small"
                    sx={{ color: Colors.black }}
                  />
                </Link>
              </Box>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={5} md={6}>
              <JsonLanguageBlock variant="h2" value={game.theme.name} noWrap />
              <Typography variant="caption">
                {moment(game.created_at).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: px(3) }}>
                <Typography variant="body1">{t("commun.versus")}</Typography>
                <Typography variant="h6">
                  {isPlayer1 && game.player2
                    ? game.player2.username
                    : game.player1.username}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
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
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ color: color }}>
                    {win === 0.5
                      ? t("commun.draw")
                      : win === 1
                      ? t("commun.victory")
                      : t("commun.defeat")}
                  </Typography>
                  <Typography variant="h2" sx={{ color: color }}>
                    {isPlayer1
                      ? `${game.ptsplayer1} - ${game.ptsplayer2}`
                      : `${game.ptsplayer2} - ${game.ptsplayer1}`}
                  </Typography>
                </Box>
                <Link to={`/game/duel/${game.uuid}`} style={{ height: px(20) }}>
                  <VisibilityIcon
                    fontSize="small"
                    sx={{ color: Colors.black }}
                  />
                </Link>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};
