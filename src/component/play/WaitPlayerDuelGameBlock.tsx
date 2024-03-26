import { Box, CircularProgress, Typography } from "@mui/material";
import { percent } from "csx";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { StatusPlayerGame } from "../StatusPlayer";

import BoltIcon from "@mui/icons-material/Bolt";

interface Props {
  game: DuelGame;
  players: Array<string>;
}
export const WaitPlayerDuelGameBlock = ({ game, players }: Props) => {
  return (
    <Box
      sx={{
        width: percent(100),
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: Colors.blue,
          height: percent(50),
          width: percent(100),
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-start",
          p: 5,
          borderBottom: "5px solid white",
        }}
      >
        <AvatarAccount
          avatar={game.player1.avatar}
          size={100}
          color={Colors.white}
        />
        <Box>
          <Typography variant="h2">{game.player1.username}</Typography>
          <StatusPlayerGame ready={players.includes(game.player1.id)} />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: percent(50),
          left: percent(50),
          translate: "-50% -50%",
          borderRadius: percent(100),
          m: 1,
        }}
      >
        <Box
          sx={{
            borderRadius: percent(50),
            width: 100,
            height: 100,
            bgcolor: Colors.black,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BoltIcon sx={{ fontSize: 70, color: Colors.white }} />
        </Box>
        <CircularProgress
          sx={{
            color: Colors.white,
            position: "absolute",
            top: -10,
            left: -10,
            zIndex: 1,
          }}
          size={120}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: Colors.pink,
          height: percent(50),
          width: percent(100),
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-end",
          p: 5,
          borderTop: "5px solid white",
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h2">{game.player2.username}</Typography>
          <StatusPlayerGame ready={players.includes(game.player2.id)} />
        </Box>
        <AvatarAccount
          avatar={game.player2.avatar}
          size={100}
          color={Colors.white}
        />
      </Box>
    </Box>
  );
};
