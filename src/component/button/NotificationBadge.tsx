import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Badge, Box } from "@mui/material";
import { padding, px } from "csx";
import { useMemo } from "react";
import { useNotification } from "src/context/NotificationProvider";
import { Colors } from "src/style/Colors";

export const NotificationBadge = () => {
  const { notifications } = useNotification();

  const number = useMemo(() => notifications.length, [notifications]);
  return (
    <Badge badgeContent={number} color="error">
      <Box
        sx={{
          p: padding(2, 8),
          border: "2px solid",
          borderColor: Colors.white,
          borderRadius: px(5),
          display: "flex",
        }}
      >
        {number > 0 ? (
          <NotificationsActiveIcon sx={{ color: Colors.white }} />
        ) : (
          <NotificationsIcon sx={{ color: Colors.white }} />
        )}
      </Box>
    </Badge>
  );
};
