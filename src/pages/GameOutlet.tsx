import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useEffect, useMemo } from "react";

import { updateProfilByFunction } from "src/api/profile";
import { UpdateNotificationBlock } from "src/component/notification/UpdateNotificationBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useNotification } from "src/context/NotificationProvider";
import { NotificationType } from "src/models/enum/NotificationType";
import { DuelNotificationBlock } from "src/component/notification/DuelNotificationBlock";
import { BattleNotificationBlock } from "src/component/notification/BattleNotificationBlock";
import { percent } from "csx";

export default function GameOutlet() {
  const { profile, setStreak } = useAuth();
  const { notifications, getNotifications } = useNotification();

  const duelGames = useMemo(
    () =>
      [...notifications].filter(
        (el) => el.type === NotificationType.duel_request && !el.isread
      ),
    [notifications]
  );
  const battles = useMemo(
    () =>
      [...notifications].filter(
        (el) => el.type === NotificationType.battle_request && !el.isread
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
          bottom: 5,
          right: 5,
          display: "flex",
          gap: 2,
          alignItems: "end",
          flexDirection: "column",
          zIndex: 20,
          maxWidth: percent(98),
        }}
      >
        {duelGames.map((game) => (
          <DuelNotificationBlock
            key={game.id}
            notification={game}
            onDelete={getNotifications}
          />
        ))}
        {battles.map((battle) => (
          <BattleNotificationBlock
            key={battle.id}
            notification={battle}
            onDelete={getNotifications}
          />
        ))}
        <UpdateNotificationBlock />
      </Box>
    </>
  );
}
