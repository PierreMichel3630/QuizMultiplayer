import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { Timer } from "src/component/Timer";
import { AvatarAccount } from "src/component/avatar/AvatarAccount";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";

export const DuelPage = () => {
  const { id } = useParams();

  const [game, setGame] = useState<undefined | DuelGame>(undefined);
  const [timer, setTimer] = useState<undefined | number>(undefined);
  const color1 = Colors.green;
  const color2 = Colors.red;

  useEffect(() => {
    const getGame = () => {
      if (id) {
        selectDuelGameById(Number(id)).then((res) => {
          setGame(res.data as DuelGame);
          setTimer(50);
        });
      }
    };
    getGame();
  }, [id]);

  return (
    <Container maxWidth="sm" sx={{ pt: 4 }}>
      {game && (
        <Grid container spacing={1}>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AvatarAccount
              avatar={game.player1.avatar}
              size={50}
              color={color1}
            />
            <Box>
              <Typography variant="h6" sx={{ color: color1 }}>
                {game.player1.username}
              </Typography>
              <Typography variant="h2" sx={{ color: color1 }}>
                {game.ptsplayer1}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {timer && (
                <Timer time={timer} size={45} thickness={6} fontSize={15} />
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ color: color2 }}>
                {game.player2.username}
              </Typography>
              <Typography variant="h2" sx={{ color: color2 }}>
                {game.ptsplayer2}
              </Typography>
            </Box>
            <AvatarAccount
              avatar={game.player1.avatar}
              size={50}
              color={color2}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};
