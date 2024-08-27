import { Avatar, Box, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { Player, PlayerResponse } from "src/models/Player";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";
import { useUser } from "src/context/UserProvider";
import { sortByScore } from "src/utils/sort";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const imgCss = style({
  width: px(30),
});

const IconPosition: { [key: number]: string } = {
  1: rank1,
  2: rank2,
  3: rank3,
};

interface Props {
  players: Array<Player>;
  responses: Array<PlayerResponse>;
}

export const MyRankBlock = ({ players, responses }: Props) => {
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
            <img src={rank1} className={imgCss} loading="lazy" />
          </Avatar>
        );
        break;
      case 2:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank2} className={imgCss} loading="lazy" />
          </Avatar>
        );
        break;
      case 3:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank3} className={imgCss} loading="lazy" />
          </Avatar>
        );
        break;
    }
    return icon;
  };

  const playersSort = [...players].sort(sortByScore);
  const position = playersSort.findIndex((el) => el.uuid === uuid);
  const player = position !== -1 ? players[position] : undefined;
  const response = responses.find((el) => el.uuid === uuid);

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
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            {getIcon(position)}
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              {player.username}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              alignContent: "center",
            }}
          >
            {response && (
              <Box>
                {response.position ? (
                  <img
                    src={IconPosition[response.position]}
                    className={imgCss}
                  />
                ) : (
                  <CheckCircleRoundedIcon sx={{ color: Colors.green }} />
                )}
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: px(80),
                justifyContent: "flex-end",
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
        </Box>
      )}
    </Paper>
  );
};
