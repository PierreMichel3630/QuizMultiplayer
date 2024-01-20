import { Avatar, Box, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { Player } from "src/models/Player";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { useUser } from "src/context/UserProvider";
import { sortByScore } from "src/utils/sort";

const imgCss = style({
  width: px(30),
});

interface Props {
  players: Array<Player>;
}

export const MyRankBlock = ({ players }: Props) => {
  const { uuid } = useUser();

  const getIcon = (index: number) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.purple }}>
        <Typography variant="h2" sx={{ ml: px(3), mr: px(3) }}>
          {index + 1}
        </Typography>
      </Avatar>
    );
    switch (index + 1) {
      case 1:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank1} className={imgCss} />
          </Avatar>
        );
        break;
      case 2:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank2} className={imgCss} />
          </Avatar>
        );
        break;
      case 3:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank3} className={imgCss} />
          </Avatar>
        );
        break;
    }
    return icon;
  };

  const playersSort = [...players].sort(sortByScore);
  const position = playersSort.findIndex((el) => el.uuid === uuid);
  const player = position !== -1 ? players[position] : undefined;

  return (
    <Paper sx={{ p: 1 }}>
      {player && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {getIcon(position)}
          <Typography variant="body1" sx={{ fontSize: 20 }}>
            {player.username}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" sx={{ fontSize: 30 }} component="span">
              {player.score}
            </Typography>
            <Typography variant="body1" component="span">
              PTS
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
