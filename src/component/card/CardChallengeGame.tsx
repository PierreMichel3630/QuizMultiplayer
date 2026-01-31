import { Box, Grid, Paper, Typography } from "@mui/material";
import { ChallengeRanking } from "src/models/Challenge";
import { PositionTypography } from "../typography/PositionTypography";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { px } from "csx";
import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  game: ChallengeRanking;
}

export const CardChallengeGame = ({ game }: Props) => {
  const location = useLocation();
  const { hasPlayChallenge } = useAuth();

  const showGame = useMemo(() => {
    const result =
      hasPlayChallenge || moment(game.challenge.date).diff(moment(), "day") < 0;
    return result;
  }, [hasPlayChallenge, game]);

  return (
    <Paper
      sx={{
        p: 1,
      }}
      elevation={8}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ textAlign: "center" }}
      >
        <Grid size={3}>
          <Typography variant="h6">
            {moment(game.challenge.date).format("DD/MM/YY")}
          </Typography>
        </Grid>
        <Grid size={3}>
          <PositionTypography position={game.ranking} />
        </Grid>
        <Grid size={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <QuestionMarkIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {game.score} / {NUMBER_QUESTIONS_CHALLENGE}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="h6" noWrap>
                {(game.time / 1000).toFixed(2)}s
              </Typography>
            </Box>
          </Box>
        </Grid>
        {showGame && (
          <Grid size={2}>
            <Link
              to={`/challenge/game/${game.uuid}`}
              state={{
                previousPath: location.pathname,
              }}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <VisibilityIcon sx={{ color: "text.primary" }} />
            </Link>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
