import { Paper, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import { ImageTypeCard } from "src/component/image/ImageCard";
import { useGames } from "src/hook/useGame";
import { SearchType } from "src/models/enum/TypeCardEnum";
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
              <Grid size={12} key={game.id}>
                <Link
                  to={`/gamemode/${game.id}`}
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
                    <ImageTypeCard
                      type={SearchType.GAME}
                      value={{
                        image: game.image,
                        color: Colors.colorBrainTest,
                        created_at: game.created_at,
                      }}
                      size={80}
                    />
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
