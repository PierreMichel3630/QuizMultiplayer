import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { AvatarAccount } from "../avatar/AvatarAccount";

import HomeIcon from "@mui/icons-material/Home";
import BoltIcon from "@mui/icons-material/Bolt";

interface Props {
  game: DuelGame;
}

export const CancelDuelGameBlock = ({ game }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
            <Typography variant="h1">{t("commun.cancelgame")}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {t("commun.opponentdontjoin")}
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
            <AvatarAccount
              avatar={game.player1.avatar}
              size={80}
              color={Colors.blue}
            />
            <Typography variant="h4" sx={{ color: Colors.blue }}>
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
            <AvatarAccount
              avatar={game.player2.avatar}
              size={80}
              color={Colors.pink}
            />
            <Typography variant="h4" sx={{ color: Colors.pink }}>
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
