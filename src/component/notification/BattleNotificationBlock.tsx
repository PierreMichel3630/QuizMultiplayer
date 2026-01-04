import { Box, Grid, Paper } from "@mui/material";
import { percent, px } from "csx";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import { deleteBattleByUuid } from "src/api/game";
import { useUser } from "src/context/UserProvider";
import { ModeGame } from "src/models/ModeGame";
import { Notification } from "src/models/Notification";
import { Profile } from "src/models/Profile";
import { ButtonColor } from "../Button";
import { NotificationDuration } from "./NotificationDuration";

interface Props {
  notification: Notification;
  onDelete: (notification: Notification) => void;
}

interface NotificationData {
  uuid: string;
  user: Profile;
}

export const BattleNotificationBlock = ({ notification, onDelete }: Props) => {
  const navigate = useNavigate();
  const { language } = useUser();
  const { t } = useTranslation();

  const data = useMemo(
    () => notification.data as NotificationData,
    [notification]
  );

  const playBattle = (uuid: string) => {
    navigate(`/battle/${uuid}`);
    onDelete(notification);
  };

  const refuseBattle = async (uuid: string) => {
    await deleteBattleByUuid(uuid);
    onDelete(notification);
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
        zIndex: 1500,
        p: px(5),
        width: percent(100),
      }}
      elevation={8}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box>
              <ImageThemeBlock theme={mode} size={70} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Trans
                i18nKey={t("commun.confrontmodeuser")}
                values={{
                  username: data.user.username,
                  theme: language ? mode.name[language.iso] : "",
                }}
                components={{ bold: <strong /> }}
              />
              <Box>
                <NotificationDuration date={notification.created_at} />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <ButtonColor
            typography="h6"
            iconSize={20}
            value={Colors.green}
            label={t("commun.accept")}
            icon={CheckIcon}
            variant="contained"
            onClick={() => playBattle(data.uuid)}
          />
        </Grid>
        <Grid item xs={6}>
          <ButtonColor
            typography="h6"
            iconSize={20}
            value={Colors.red}
            label={t("commun.refuse")}
            icon={CloseIcon}
            variant="contained"
            onClick={() => refuseBattle(data.uuid)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
