import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import { updateFriend } from "src/api/friend";
import { useMessage } from "src/context/MessageProvider";
import { useNotification } from "src/context/NotificationProvider";
import { FRIENDSTATUS, FriendUpdate } from "src/models/Friend";
import { Notification } from "src/models/Notification";
import { Profile } from "src/models/Profile";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { ButtonColor } from "../Button";
import { NotificationDuration } from "./NotificationDuration";

interface Props {
  notification: Notification;
  onDelete?: (notification: Notification) => void;
}

interface NotificationData {
  id: string;
  user: Profile;
}

export const FriendNotificationBlock = ({ notification, onDelete }: Props) => {
  const { t } = useTranslation();
  const { getFriends } = useApp();
  const { getNotifications } = useNotification();
  const { setMessage, setSeverity } = useMessage();

  const data = useMemo(
    () => notification.data as NotificationData,
    [notification]
  );

  const confirmFriend = (status: FRIENDSTATUS) => {
    const value: FriendUpdate = {
      id: data.id,
      status: status,
    };
    updateFriend(value).then(({ error }) => {
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        if (onDelete) {
          onDelete(notification);
        }
        setSeverity("success");
        setMessage(
          status === FRIENDSTATUS.VALID
            ? t("alert.validatefriendrequest")
            : t("alert.refusefriendrequest")
        );
        getFriends();
        getNotifications();
      }
    });
  };

  return (
    <Paper
      sx={{
        zIndex: 1500,
        p: 1,
        width: percent(100),
      }}
      elevation={8}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box>
              <AvatarAccount avatar={data.user.avatar.icon} size={50} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                {t("commun.notificationfriend", {
                  username: data.user.username,
                })}
              </Typography>
              <NotificationDuration date={notification.created_at} />
            </Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <ButtonColor
            typography="h6"
            iconSize={20}
            value={Colors.green}
            label={t("commun.accept")}
            icon={CheckIcon}
            variant="contained"
            onClick={() => confirmFriend(FRIENDSTATUS.VALID)}
          />
        </Grid>
        <Grid size={6}>
          <ButtonColor
            typography="h6"
            iconSize={20}
            value={Colors.red}
            label={t("commun.refuse")}
            icon={CloseIcon}
            variant="contained"
            onClick={() => confirmFriend(FRIENDSTATUS.REFUSE)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
