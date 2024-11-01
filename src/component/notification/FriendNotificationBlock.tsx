import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { updateFriend } from "src/api/friend";
import { useMessage } from "src/context/MessageProvider";
import { FRIENDSTATUS, Friend, FriendUpdate } from "src/models/Friend";
import { AvatarAccount } from "../avatar/AvatarAccount";

interface Props {
  friend: Friend;
}

export const FriendNotificationBlock = ({ friend }: Props) => {
  const { t } = useTranslation();
  const { getFriends } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const confirmFriend = (status: FRIENDSTATUS) => {
    const value: FriendUpdate = {
      id: friend.id,
      status: status,
    };
    updateFriend(value).then(({ error }) => {
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(
          status === FRIENDSTATUS.VALID
            ? t("alert.validatefriendrequest")
            : t("alert.refusefriendrequest")
        );
        getFriends();
      }
    });
  };

  return (
    <Paper
      sx={{
        zIndex: 1,
        p: 1,
        width: percent(100),
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
          <AvatarAccount avatar={friend.user1.avatar.icon} size={50} />
        </Box>
        <Box>
          <Typography variant="body1" component="span">
            {t("commun.notificationfriend", {
              username: friend.user1.username,
            })}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              p: px(5),
              backgroundColor: Colors.green2,
              borderRadius: px(5),
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => confirmFriend(FRIENDSTATUS.VALID)}
          >
            <CheckIcon sx={{ color: Colors.white }} />
          </Box>
          <Box
            sx={{
              p: px(5),
              backgroundColor: Colors.red2,
              borderRadius: px(5),
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => confirmFriend(FRIENDSTATUS.REFUSE)}
          >
            <CloseIcon sx={{ color: Colors.white }} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
