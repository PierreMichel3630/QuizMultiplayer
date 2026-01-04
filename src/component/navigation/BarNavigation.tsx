import { Box, Container, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  title: string;
  quit?: () => void;
}
export const BarNavigation = ({ title, quit }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: percent(100),
        zIndex: 100,
        height: 62,
        display: "flex",
        alignItems: "center",
        backgroundColor: Colors.colorApp,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ p: px(5) }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid
              sx={{ cursor: "pointer" }}
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
              <KeyboardBackspaceIcon />
            </Grid>
            <Grid sx={{ textAlign: "center" }} size="grow">
              <Typography variant="h2">{title}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
