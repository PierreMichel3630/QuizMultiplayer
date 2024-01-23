import { Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useUser } from "src/context/UserProvider";
import { Response } from "src/models/Response";
import { Colors } from "src/style/Colors";
import { sortByTime } from "src/utils/sort";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { style } from "typestyle";

const imageCss = style({
  width: px(40),
  height: px(40),
});

interface Props {
  response: Response;
}

const InfoPosition: { [key: number]: { color: string; icon: string } } = {
  1: { color: Colors.gold, icon: rank1 },
  2: { color: Colors.silver, icon: rank2 },
  3: { color: Colors.bronze, icon: rank3 },
};

export const ResponseBlock = ({ response }: Props) => {
  const { language } = useUser();
  const value = response.response[language.iso]
    ? response.response[language.iso]
    : response.response["fr-FR"];

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Grid container spacing={1}>
      {response.players.sort(sortByTime).map((player, index) => {
        const info = InfoPosition[index + 1];
        return (
          <Grid item xs={12} key={player.uuid}>
            <Paper
              sx={{
                p: 1,
                backgroundColor: info.color,
                borderRadius: px(10),
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: percent(100),
              }}
            >
              <img src={info.icon} className={imageCss} />
              <Typography variant="h2" sx={{ color: "white" }}>
                {player.username}
              </Typography>
              <Typography variant="h4" sx={{ color: "white" }}>
                {(player.time / 1000).toFixed(2)}s
              </Typography>
            </Paper>
          </Grid>
        );
      })}
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 1,
            backgroundColor: Colors.green,
            borderRadius: px(10),
            textAlign: "center",
            width: percent(100),
          }}
        >
          <Typography variant="h2" sx={{ color: "white" }}>
            {label}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
