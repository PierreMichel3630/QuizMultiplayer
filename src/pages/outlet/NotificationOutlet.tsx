import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useEffect, useMemo } from "react";

import { percent, px } from "csx";
import { updateProfilByFunction } from "src/api/profile";
import { NotificationBlock } from "src/component/notification/NotificationBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useNotification } from "src/context/NotificationProvider";
import { NotificationType } from "src/models/enum/NotificationType";

export default function NotificationOutlet() {
  const { profile, setStreak } = useAuth();
  const { notificationUpdate, notifications, getNotifications } =
    useNotification();

  const gamesNotifications = useMemo(
    () =>
      [...notifications].filter(
        (el) =>
          (el.type === NotificationType.duel_request ||
            el.type === NotificationType.battle_request) &&
          !el.isread
      ),
    [notifications]
  );

  useEffect(() => {
    const handleVisibility = async () => {
      if (profile?.id && !document.hidden) {
        updateProfilByFunction().then(({ data }) => {
          if (data !== null) {
            setStreak(data.streak);
          }
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [profile?.id, setStreak]);

  return (
    <>
      <Outlet />
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          display: "flex",
          gap: 2,
          alignItems: "end",
          flexDirection: "column",
          zIndex: 20,
          maxWidth: percent(100),
          margin: px(5),
        }}
      >
        {}
        {gamesNotifications.map((notification) => (
          <NotificationBlock
            key={notification.id}
            notification={notification}
            onDelete={getNotifications}
          />
        ))}
        {notificationUpdate && (
          <NotificationBlock
            notification={notificationUpdate}
            onDelete={getNotifications}
          />
        )}
      </Box>
    </>
  );
}
