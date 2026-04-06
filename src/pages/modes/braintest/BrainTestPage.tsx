import { Paper, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import { BadgeNew } from "src/component/badge/BadgeNew";
import { ImageCard } from "src/component/image/ImageCard";
import { useGames } from "src/hook/useGame";
import { Colors } from "src/style/Colors";
import { GameModeType } from "src/utils/mode";

export default function BrainTestPage() {
  const { t } = useTranslation();
  const games = useGames();
  const gamesBrainTest = useMemo(
    () => [...games].filter((el) => el.subtype === GameModeType.BRAIN),
    [games],
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.braintest.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={1}>
            {gamesBrainTest.map((game) => (
              <Grid size={12} key={game.identifier}>
                <Link
                  to={`/gamemode/${game.identifier}`}
                  style={{ textDecoration: "none" }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                    elevation={8}
                  >
                    <Box
                      sx={{
                        position: "relative",
                      }}
                    >
                      <BadgeNew date={game.created_at} />
                      <ImageCard value={{ image: game.image, color: Colors.colorBrainTest }} size={80} />
                    </Box>
                    <Box
                      sx={{ display: " flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography variant="h4">{game.name}</Typography>
                      <Typography>{game.description}</Typography>
                    </Box>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
