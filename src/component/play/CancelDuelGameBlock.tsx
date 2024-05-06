import { Box, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import BoltIcon from "@mui/icons-material/Bolt";
import HomeIcon from "@mui/icons-material/Home";
import { COLORDUEL1, COLORDUEL2 } from "src/pages/play/DuelPage";
import { ButtonColor } from "../Button";
import { LabelRankBlock } from "../RankBlock";

interface Props {
  game: DuelGame;
}

export const CancelDuelGameBlock = ({ game }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box sx={{ pt: 3, pr: 1, pl: 1 }}>
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
            color="text.secondary"
            sx={{ wordBreak: "break-all" }}
            value={game.theme.name}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1" color="text.secondary">
            {t("commun.cancelgame")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
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
          <AvatarAccountBadge
            profile={game.player1}
            size={80}
            color={COLORDUEL1}
          />
          <Typography variant="h4" sx={{ color: COLORDUEL1 }}>
            {game.player1.username}
          </Typography>
          {game.player1.title && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              value={game.player1.title.name}
            />
          )}
          <LabelRankBlock player={game.player1.id} theme={game.theme.id} />
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
          <AvatarAccountBadge
            profile={game.player2}
            size={80}
            color={COLORDUEL2}
          />
          <Typography variant="h4" sx={{ color: COLORDUEL2 }}>
            {game.player2.username}
          </Typography>
          {game.player2.title && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              value={game.player2.title.name}
            />
          )}
          <LabelRankBlock player={game.player2.id} theme={game.theme.id} />
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.returnhome")}
            icon={HomeIcon}
            onClick={() => navigate("/")}
            variant="contained"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
