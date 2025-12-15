import { Box, Grid, Paper } from "@mui/material";
import { percent, px } from "csx";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cancelDuelByUuid } from "src/api/game";
import { Colors } from "src/style/Colors";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import { supabase } from "src/api/supabase";
import { useUser } from "src/context/UserProvider";
import { Notification } from "src/models/Notification";
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { NotificationDuration } from "./NotificationDuration";

interface Props {
  notification: Notification;
  onDelete: (notification: Notification) => void;
}

interface NotificationData {
  uuid: string;
  user: Profile;
  theme: Theme;
}

export const DuelNotificationBlock = ({ notification, onDelete }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useUser();

  const data = useMemo(
    () => notification.data as NotificationData,
    [notification]
  );

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
    onDelete(notification);
  };

  const themeText = useMemo(() => {
    const themeLanguage = [...data.theme.themetranslation].find(
      (el) => el.language.id === language?.id
    );
    return themeLanguage?.name ?? data.theme.themetranslation[0].name;
  }, [data, language]);

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
              <ImageThemeBlock theme={data.theme} size={70} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Trans
                i18nKey={t("commun.challengeuser")}
                values={{
                  username: data.user.username,
                  theme: themeText,
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
            onClick={() => playDuel(data.uuid)}
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
            onClick={() => refuseDuel(data.uuid)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
