import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { BarVictory } from "../chart/BarVictory";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Profile } from "src/models/Profile";

interface Props {
  opposition: { games: number; victory: number; draw: number; defeat: number };
  opponent: Profile;
  loading?: boolean;
}

export const CardOpposition = ({ opposition, opponent }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  return (
    <Paper
      sx={{
        overflow: "hidden",
        height: percent(100),
        backgroundColor: Colors.grey,
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.blue3,
            p: px(5),
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2" color="text.secondary">
            {t("commun.opposition")}
          </Typography>
          <Link
            to={`/games`}
            state={{
              player: profile,
              type: "DUEL",
              opponent: opponent,
            }}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <VisibilityIcon fontSize="large" sx={{ color: "white" }} />
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              p: 1,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1" component="span">
                  {t("commun.games")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {opposition.games}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <BarVictory
                  victory={opposition.victory}
                  draw={opposition.draw}
                  defeat={opposition.defeat}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
