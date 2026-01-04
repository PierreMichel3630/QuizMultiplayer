import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useEffect, useState } from "react";

import { px } from "csx";
import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { DrawerMenus } from "src/component/drawer/DrawerMenus";
import { OfflineBlock } from "src/component/OfflineBlock";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { drawerWidth } from "src/utils/config";

export default function NavigationOutletPage() {
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
        {!isMobileOrTablet && <DrawerMenus />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isMobileOrTablet ? `100%` : `calc(100% - ${drawerWidth}px)`,
            mb: isMobileOrTablet ? px(60) : 0,
          }}
        >
          <Container maxWidth="lg">
            {online ? <Outlet /> : <OfflineBlock />}
          </Container>
        </Box>
      </Box>
      {isMobileOrTablet && <BottomNavigationBlock />}
    </>
  );
}
