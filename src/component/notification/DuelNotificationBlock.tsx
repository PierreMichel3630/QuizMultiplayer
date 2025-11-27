import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cancelDuelByUuid } from "src/api/game";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "src/api/supabase";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";

interface Props {
  game: DuelGame;
  refuse?: () => void;
}

export const DuelNotificationBlock = ({ game, refuse }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useUser();

  const playDuel = (uuid: string) => {
    navigate(`/duel/${uuid}`);
  };

  const refuseDuel = async (uuid: string) => {
    const channel = supabase.channel(uuid);
    channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return null;
      }
      channel.send({
        type: "broadcast",
        event: "cancel",
      });
    });
    await cancelDuelByUuid(uuid);
    if (refuse) refuse();
  };

  const themeText = useMemo(() => {
    const themeLanguage = [...game.theme.themetranslation].find(
      (el) => el.language.id === language?.id
    );
    return themeLanguage?.name ?? game.theme.themetranslation[0].name;
  }, [game.theme, language]);

  return (
    <Paper
      sx={{
        zIndex: 1500,
        p: px(5),
        width: percent(100),
        backgroundColor: Colors.black,
        border: "2px solid white",
        borderRadius: px(5),
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
          <ImageThemeBlock theme={game.theme} size={70} />
        </Box>
        <Box>
          <Typography
            variant="body1"
            component="span"
            sx={{ fontSize: 15 }}
            color="text.secondary"
          >
            <Trans
              i18nKey={t("commun.challengeuser")}
              values={{
                username: game.player1
                  ? game.player1.username
                  : t("commun.unknown"),
                theme: game ? themeText : t("commun.unknown"),
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
