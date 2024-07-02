import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "src/context/UserProvider";
import { BattleGame } from "src/models/BattleGame";
import { deleteBattleByUuid } from "src/api/game";
import { useAuth } from "src/context/AuthProviderSupabase";
import { ModeGame } from "src/models/ModeGame";

interface Props {
  game: BattleGame;
  refuse?: () => void;
}

export const BattleNotificationBlock = ({ game, refuse }: Props) => {
  const navigate = useNavigate();
  const { language } = useUser();
  const { user } = useAuth();
  const { t } = useTranslation();

  const playBattle = (uuid: string) => {
    navigate(`/battle/${uuid}`);
  };

  const refuseBattle = async (uuid: string) => {
    await deleteBattleByUuid(uuid);
    if (refuse) {
      refuse();
    }
  };
  const mode: ModeGame = {
    image:
      "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
    color: "#a569bd",
    name: {
      "fr-FR": "Combat contre un ami",
      "en-US": "Fight against a friend",
    },
  };

  return (
    <Paper
      sx={{
        zIndex: 1,
        p: px(5),
        width: percent(100),
        backgroundColor: Colors.black,
      }}
    >
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
          <ImageThemeBlock theme={mode} size={70} />
        </Box>
        <Box>
          <Typography
            variant="body1"
            component="span"
            sx={{ fontSize: 15 }}
            color="text.secondary"
          >
            <Trans
              i18nKey={t("commun.challenge")}
              values={{
                username:
                  user && user.id === game.player1.id
                    ? game.player2
                      ? game.player2.username
                      : t("commun.unknown")
                    : game.player1.username,
                theme: mode.name[language.iso],
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
            onClick={() => playBattle(game.uuid)}
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
            onClick={() => refuseBattle(game.uuid)}
          >
            <CloseIcon sx={{ color: Colors.white }} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
