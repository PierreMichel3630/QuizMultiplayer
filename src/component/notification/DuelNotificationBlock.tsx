import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteDuelByUuid } from "src/api/game";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "src/context/UserProvider";

interface Props {
  game: DuelGame;
  refuse?: () => void;
}

export const DuelNotificationBlock = ({ game, refuse }: Props) => {
  const navigate = useNavigate();
  const { language } = useUser();
  const { t } = useTranslation();

  const playDuel = (uuid: string) => {
    navigate(`/duel/${uuid}`);
  };

  const refuseDuel = async (uuid: string) => {
    await deleteDuelByUuid(uuid);
    if (refuse) refuse();
  };

  return (
    <Paper sx={{ zIndex: 1, p: 1, width: percent(100) }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <ImageThemeBlock theme={game.theme} size={60} />
        </Box>
        <Box>
          <Typography variant="body1" component="span">
            <Trans
              i18nKey={t("commun.challenge")}
              values={{
                username: game.player1
                  ? game.player1.username
                  : t("commun.unknown"),
                theme: game
                  ? game.theme.name[language.iso]
                  : t("commun.unknown"),
              }}
              components={{ bold: <strong /> }}
            />
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              p: px(5),
              backgroundColor: Colors.green2,
              borderRadius: px(5),
              cursor: "pointer",
            }}
            onClick={() => playDuel(game.uuid)}
          >
            <CheckIcon sx={{ color: Colors.white }} />
          </Box>
          <Box
            sx={{
              p: px(5),
              backgroundColor: Colors.red2,
              borderRadius: px(5),
              cursor: "pointer",
            }}
            onClick={() => refuseDuel(game.uuid)}
          >
            <CloseIcon sx={{ color: Colors.white }} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
