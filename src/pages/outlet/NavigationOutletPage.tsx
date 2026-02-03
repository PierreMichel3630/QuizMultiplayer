import { Box, Container } from "@mui/material";
import { Outlet, useMatches } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import { px } from "csx";
import { BottomNavigationBlock } from "src/component/BottomNavigation";
import { DrawerMenus } from "src/component/drawer/DrawerMenus";
import { OfflineBlock } from "src/component/OfflineBlock";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { drawerWidth } from "src/utils/config";
import { RouteHandle } from "src/models/Route";
import { AppBarBlock } from "src/component/appbar/AppBarBlock";

export default function NavigationOutletPage() {
  const isMobileOrTablet = useIsMobileOrTablet();
  const matches = useMatches();

  const withAppBar = useMemo(
    () =>
      matches.some(
        (match) => (match.handle as RouteHandle | undefined)?.withAppBar,
      ),
    [matches],
  );

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
        <DrawerMenus />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isMobileOrTablet ? `100%` : `calc(100% - ${drawerWidth}px)`,
            mb: isMobileOrTablet ? px(60) : 0,
          }}
        >
          <Container maxWidth="xl">
            {online ? (
              <>
                <AppBarBlock withAppBar={withAppBar} />
                <Outlet />
              </>
            ) : (
              <OfflineBlock />
            )}
          </Container>
        </Box>
      </Box>
      {isMobileOrTablet && <BottomNavigationBlock />}
    </>
  );
}
