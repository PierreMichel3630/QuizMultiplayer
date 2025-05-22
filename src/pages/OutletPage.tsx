import { Container, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";

import { useEffect, useState } from "react";

import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { OfflineBlock } from "src/component/OfflineBlock";
import { Colors } from "src/style/Colors";

export default function OutletPage() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    return () => {
      window.removeEventListener("online", () => setOnline(true));
      window.removeEventListener("offline", () => setOnline(false));
    };
  }, []);

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: "background.paper",
            zIndex: 100,
            position: "sticky",
            borderBottom: `2px solid ${Colors.lightgrey}`,
            top: 0,
          }}
        >
          <Header />
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 8 }}>
          <Container maxWidth="md" sx={{ p: 0 }}>
            {online ? <Outlet /> : <OfflineBlock />}
          </Container>
        </Grid>
      </Grid>
      <BottomNavigationBlock />
    </>
  );
}
