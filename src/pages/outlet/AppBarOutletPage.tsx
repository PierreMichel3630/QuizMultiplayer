import { AppBar, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "src/component/header/Header";
import { DefaultToolbar } from "src/component/toolbar/Toolbar";

import { useIsMobileOrTablet } from "src/hook/useSize";
import { Colors } from "src/style/Colors";

export default function AppBarOutletPage() {
  const isMobileOrTablet = useIsMobileOrTablet();

  return (
    <>
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
      <DefaultToolbar />
      <Outlet />
    </>
  );
}
