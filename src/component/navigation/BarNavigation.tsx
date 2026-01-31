import { Box, Container, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { percent, px } from "csx";
import { BarNavigationSize } from "src/utils/config";

interface Props {
  title?: string;
  content?: JSX.Element;
  quit?: () => void;
}
export const BarNavigation = ({ title, content, quit }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: percent(100),
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        height: px(BarNavigationSize),
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ p: px(5) }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid
              sx={{ cursor: "pointer", display: "flex" }}
              onClick={() => {
                if (quit) {
                  quit();
                } else {
                  const path =
                    location.state !== null && location.state.previousPath;
                  navigate(path ? location.state.previousPath : -1);
                }
              }}
            >
              <ArrowBackIcon />
            </Grid>
            <Grid size="grow" sx={{ textAlign: "center" }}>
              {content ?? <Typography variant="h2">{title}</Typography>}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export const ToolbarBarNavigation = () => (
  <Box sx={{ height: px(BarNavigationSize) }} />
);
