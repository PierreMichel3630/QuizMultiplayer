import { Container, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";

import { useEffect, useState } from "react";

import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { OfflineBlock } from "src/component/OfflineBlock";
import { StreakLoginModal } from "src/component/modal/StreakLoginModal";
import { useAuth } from "src/context/AuthProviderSupabase";

export default function OutletPage() {
  const { profile } = useAuth();

  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [, setLoginStreak] = useState<number | null>(null);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    return () => {
      window.removeEventListener("online", () => setOnline(true));
      window.removeEventListener("offline", () => setOnline(false));
    };
  }, []);

  useEffect(() => {
    if (profile) {
      setLoginStreak((prev) => {
        if (prev && prev + 1 === profile.loginstreak) {
          setOpen(true);
        }
        return profile.loginstreak;
      });
    }
  }, [profile]);

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
      <StreakLoginModal open={open} close={() => setOpen(false)} />
    </>
  );
}
