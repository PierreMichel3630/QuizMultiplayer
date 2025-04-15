import { Box } from "@mui/material";
import { percent } from "csx";
import { Outlet } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";
import {
  selectInvitationBattleByUser,
  selectInvitationBattleByUuid,
  selectInvitationDuelByUser,
  selectInvitationDuelByUuid,
} from "src/api/game";
import { supabase } from "src/api/supabase";
import { DuelGame, DuelGameChange } from "src/models/DuelGame";

import { RealtimeChannel } from "@supabase/supabase-js";
import { updateProfilByFunction } from "src/api/profile";
import { BattleNotificationBlock } from "src/component/notification/BattleNotificationBlock";
import { DuelNotificationBlock } from "src/component/notification/DuelNotificationBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { BattleGame, BattleGameChange } from "src/models/BattleGame";
import { StatusGameDuel } from "src/models/enum/StatusGame";

export default function GameOutlet() {
  const { user, profile, setStreak } = useAuth();
  const { getFriends } = useApp();

  const [gamesChange, setGamesChange] = useState<Array<DuelGameChange>>([]);
  const [games, setGames] = useState<Array<DuelGame>>([]);
  const [battlesChange, setBattlesChange] = useState<Array<BattleGameChange>>(
    []
  );
  const [battles, setBattles] = useState<Array<BattleGame>>([]);

  useEffect(() => {
    const getGamesUuid = () => {
      const uuids = gamesChange.map((el) => el.uuid);
      if (uuids.length > 0) {
        selectInvitationDuelByUuid(uuids).then(({ data }) => {
          const value = data !== null ? (data as Array<DuelGame>) : [];
          setGames(value);
        });
      }
    };
    getGamesUuid();
  }, [gamesChange]);

  const getGames = useCallback(() => {
    if (user) {
      selectInvitationDuelByUser(user.id).then(({ data }) => {
        const value = data !== null ? (data as Array<DuelGame>) : [];
        setGames(value);
      });
    }
  }, [user]);

  useEffect(() => {
    getGames();
  }, [getGames]);

  useEffect(() => {
    const getBattleGamesUuid = () => {
      const uuids = battlesChange.map((el) => el.uuid);
      if (uuids.length > 0) {
        selectInvitationBattleByUuid(uuids).then(({ data }) => {
          const value = data !== null ? (data as Array<BattleGame>) : [];
          setBattles(value);
        });
      }
    };
    getBattleGamesUuid();
  }, [battlesChange]);

  const getBattles = useCallback(() => {
    if (user) {
      selectInvitationBattleByUser(user.id).then(({ data }) => {
        const value = data !== null ? (data as Array<BattleGame>) : [];
        setBattles(value);
      });
    }
  }, [user]);

  useEffect(() => {
    getBattles();
  }, [getBattles]);

  useEffect(() => {
    return () => {};
  }, [getFriends, profile?.id]);

  useEffect(() => {
    let channel: undefined | RealtimeChannel = undefined;
    const subscribeToRealtime = () => {
      if (profile?.id) {
        channel = supabase
          .channel(profile.id)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "duelgame",
              filter: `player2=eq.${profile.id}`,
            },
            (payload) => {
              setGamesChange((prev) => [
                ...prev,
                payload.new as DuelGameChange,
              ]);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "duelgame",
              filter: `player2=eq.${profile.id}`,
            },
            (payload) => {
              const game = payload.new as DuelGameChange;
              if (game.status === StatusGameDuel.CANCEL) {
                setGamesChange((prev) =>
                  [...prev].filter((el) => el.id !== game.id)
                );
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "battlegame",
              filter: `player2=eq.${profile.id}`,
            },
            (payload) => {
              setBattlesChange((prev) => [
                ...prev,
                payload.new as BattleGameChange,
              ]);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "battlegame",
              filter: `player2=eq.${profile.id}`,
            },
            (payload) => {
              setGamesChange((prev) =>
                [...prev].filter(
                  (el) => el.id !== (payload.old as BattleGameChange).id
                )
              );
            }
          )
          .on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "battlegame",
              filter: `player1=eq.${profile.id}`,
            },
            (payload) => {
              setGamesChange((prev) =>
                [...prev].filter(
                  (el) => el.id !== (payload.old as BattleGameChange).id
                )
              );
            }
          )
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "friend",
              filter: `user2=eq.${profile.id}`,
            },
            () => {
              getFriends();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "friend",
              filter: `user1=eq.${profile.id}`,
            },
            () => {
              getFriends();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "friend",
              filter: `user2=eq.${profile.id}`,
            },
            () => {
              getFriends();
            }
          )
          .subscribe();
      }
    };
    const handleVisibility = async () => {
      if (!document.hidden) {
        subscribeToRealtime();
      } else {
        channel?.unsubscribe();
      }
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
      channel?.unsubscribe();
    };
  }, [getFriends, setStreak, profile?.id]);

  return (
    <>
      <Outlet />
      <Box
        sx={{
          position: "fixed",
          bottom: 5,
          right: 0,
          left: percent(1),
          display: "flex",
          gap: 2,
          alignItems: "end",
          flexDirection: "column",
          width: percent(98),
          zIndex: 20,
        }}
      >
        {games.map((game) => (
          <DuelNotificationBlock key={game.id} game={game} refuse={getGames} />
        ))}
        {battles.map((battle) => (
          <BattleNotificationBlock
            key={battle.id}
            game={battle}
            refuse={getBattles}
          />
        ))}
      </Box>
    </>
  );
}
