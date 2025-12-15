import { AppBar, Box, Container, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";

import { useEffect, useState } from "react";

import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { DrawerMenus } from "src/component/drawer/DrawerMenus";
import { OfflineBlock } from "src/component/OfflineBlock";
import { DefaultToolbar } from "src/component/toolbar/Toolbar";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { Colors } from "src/style/Colors";
import { drawerWidth } from "src/utils/config";
import { px } from "csx";

export default function OutletPage() {
  const isMobileOrTablet = useIsMobileOrTablet();

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
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar
            sx={{
              background: Colors.colorApp,
            }}
            disableGutters={isMobileOrTablet}
          >
            <Header />
          </Toolbar>
        </AppBar>
        {!isMobileOrTablet && <DrawerMenus />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isMobileOrTablet ? `100%` : `calc(100% - ${drawerWidth}px)`,
            mb: isMobileOrTablet ? px(60) : 0,
          }}
        >
          <DefaultToolbar />
          <Container maxWidth="lg">
            {online ? <Outlet /> : <OfflineBlock />}
          </Container>
        </Box>
      </Box>
      {isMobileOrTablet && <BottomNavigationBlock />}
    </>
  );
}
