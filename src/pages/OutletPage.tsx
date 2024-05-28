import { Box, Container, Grid, Toolbar } from "@mui/material";
import { percent } from "csx";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";

import { useEffect, useState } from "react";
import {
  selectInvitationDuelByUser,
  selectInvitationDuelByUuid,
} from "src/api/game";
import { supabase } from "src/api/supabase";
import { useUser } from "src/context/UserProvider";
import { DuelGame, DuelGameChange } from "src/models/DuelGame";

import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { DuelNotificationBlock } from "src/component/notification/DuelNotificationBlock";
import { useApp } from "src/context/AppProvider";

export const OutletPage = () => {
  const { uuid } = useUser();
  const { getAccomplishments, getBadges, getTitles, getThemes } = useApp();

  const [gamesChange, setGamesChange] = useState<Array<DuelGameChange>>([]);
  const [games, setGames] = useState<Array<DuelGame>>([]);

  useEffect(() => {
    getAccomplishments();
    getBadges();
    getTitles();
    getThemes();
  }, []);

  useEffect(() => {
    const getGamesUuid = () => {
      const uuids = gamesChange.map((el) => el.uuid);
      selectInvitationDuelByUuid(uuids).then(({ data }) => {
        setGames(data as Array<DuelGame>);
      });
    };
    getGamesUuid();
  }, [gamesChange]);

  useEffect(() => {
    const getGames = () => {
      selectInvitationDuelByUser(uuid).then(({ data }) => {
        setGames(data as Array<DuelGame>);
      });
    };
    getGames();
  }, [uuid]);

  useEffect(() => {
    const channel = supabase
      .channel(uuid)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "duelgame",
          filter: `player2=eq.${uuid}`,
        },
        (payload) => {
          setGamesChange((prev) => [...prev, payload.new as DuelGameChange]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "duelgame",
          filter: `player2=eq.${uuid}`,
        },
        (payload) => {
          setGamesChange((prev) =>
            [...prev].filter(
              (el) => el.id !== (payload.old as DuelGameChange).id
            )
          );
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 8 }}>
          <Container maxWidth="lg" sx={{ p: 0 }}>
            <Toolbar />
            <Outlet />
          </Container>
        </Grid>
      </Grid>
      <BottomNavigationBlock />
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
        }}
      >
        {games.map((game) => (
          <DuelNotificationBlock key={game.id} game={game} />
        ))}
      </Box>
    </>
  );
};
