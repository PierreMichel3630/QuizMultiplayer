import { Avatar, Box, Divider, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
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

export const RankingGameBlock = ({ players }: Props) => {
  const { t } = useTranslation();
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

  return (
    <Paper
      sx={{
        p: 1,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h2">{t("commun.ranking")}</Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="h2">
              {players.sort(sortByScore).findIndex((el) => el.uuid === uuid) +
                1}
            </Typography>
            <Typography
              variant="h2"
              sx={{ opacity: 0.5 }}
            >{`/ ${players.length}`}</Typography>
          </Box>
        </Box>
        <Divider />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          minHeight: 0,
          flexDirection: "column",
          flex: "1 1 0",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            pr: 2,
            flexGrow: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: px(3),
              minHeight: 0,
            }}
          >
            {players.sort(sortByScore).map((player, index) => (
              <Box
                key={player.uuid}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {getIcon(index)}
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
                  <Typography
                    variant="h2"
                    sx={{ fontSize: 30 }}
                    component="span"
                  >
                    {player.score}
                  </Typography>
                  <Typography variant="body1" component="span">
                    PTS
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
