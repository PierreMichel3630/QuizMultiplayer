import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { viewHeight } from "csx";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "src/component/header/Header";
import { useApp } from "src/context/AppProvider";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "src/api/supabase";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { SwordsIcon } from "src/component/icon/SwordsIcon";
import { useUser } from "src/context/UserProvider";
import { DuelGameChange } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { deleteDuelByUuid, selectInvitationDuelByUser } from "src/api/game";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { uuid } = useUser();
  const { themes, friends } = useApp();

  const [games, setGames] = useState<Array<DuelGameChange>>([]);

  useEffect(() => {
    const getGames = () => {
      selectInvitationDuelByUser(uuid).then(({ data }) => {
        setGames(data as Array<DuelGameChange>);
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
          setGames((prev) => [...prev, payload.new as DuelGameChange]);
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
          setGames((prev) =>
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

  const playDuel = (uuid: string) => {
    navigate(`/duel/${uuid}`);
  };

  const refuseDuel = async (uuid: string) => {
    await deleteDuelByUuid(uuid);
  };

  return (
    <Container maxWidth="md" sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: viewHeight(100),
        }}
      >
        <Box>
          <Header />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          right: 15,
          display: "flex",
          gap: 2,
          alignItems: "end",
          flexDirection: "column",
        }}
      >
        <Box>
          {games.map((game) => {
            const theme = themes.find((el) => el.id === game.theme);
            const friend = friends.find(
              (el) =>
                el.user1.id === game.player1 || el.user2.id === game.player1
            );
            const profile = friend
              ? friend.user1.id === uuid
                ? friend.user1
                : friend.user2
              : undefined;
            return (
              <Paper key={game.uuid} sx={{ p: 1, maxWidth: "80vw" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h4" component="span">
                      {profile ? profile.username : t("commun.unknown")}
                    </Typography>
                    <Typography variant="body1" component="span">
                      {t("commun.challenge")}
                    </Typography>
                    {theme ? (
                      <JsonLanguageBlock
                        variant="h4"
                        component="span"
                        value={theme.name}
                      />
                    ) : (
                      <Typography variant="h4" component="span">
                        {t("commun.unknown")}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      color="success"
                      onClick={() => playDuel(game.uuid)}
                      startIcon={<CheckCircleIcon />}
                    >
                      <Typography variant="h6">{t("commun.join")}</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => refuseDuel(game.uuid)}
                    >
                      <Typography variant="h6">{t("commun.refuse")}</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Box>
        <Badge badgeContent={games.length} color="error">
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              border: `2px solid ${
                games.length > 0 ? Colors.red : Colors.white
              }`,
            }}
          >
            <SwordsIcon color={Colors.white} width={30} height={30} />
          </Paper>
        </Badge>
      </Box>
    </Container>
  );
};
