import { Box, Container } from "@mui/material";
import { viewHeight } from "csx";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";

export const HomePage = () => {
  return (
    <Container maxWidth="xl">
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
        <Box sx={{ flex: "1 1 0%", display: "flex", flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};
