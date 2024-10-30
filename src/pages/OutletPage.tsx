import { Container, Grid, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";

import { useEffect, useState } from "react";

import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { OfflineBlock } from "src/component/OfflineBlock";

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
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 8 }}>
          <Container maxWidth="md" sx={{ p: 0 }}>
            <Toolbar />
            {online ? <Outlet /> : <OfflineBlock />}
          </Container>
        </Grid>
      </Grid>
      <BottomNavigationBlock />
    </>
  );
}
