import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { AppBarProvider } from "./context/AppBarProvider";
import { AppProvider } from "./context/AppProvider";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import { MessageProvider } from "./context/MessageProvider";
import { RealtimeProvider } from "./context/NotificationProvider";
import { UserProvider, useUser } from "./context/UserProvider";
import { useViewportHeight } from "./hook/useViewportHeight";
import "./i18n/config";
import { getTheme } from "./style/ThemeBlock";

function App() {
  return (
    <Box className="fullscreen">
      <AuthProviderSupabase>
        <UserProvider>
          <AppBarProvider>
            <Body />
          </AppBarProvider>
        </UserProvider>
      </AuthProviderSupabase>
    </Box>
  );
}

export default App;

const Body = () => {
  const { language, mode } = useUser();
  const theme = useMemo(() => getTheme(mode), [mode]);

  useViewportHeight();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <AppProvider>
      <RealtimeProvider>
        <ThemeProvider theme={theme}>
          <MessageProvider>
            <CssBaseline />
            <Helmet
              htmlAttributes={{
                lang: language?.iso,
              }}
            >
              <meta
                name="description"
                content="Testez vos connaissances. Jouez en Solo ou multijoueurs sur un quiz avec plus de 500 thèmes: Cinéma, Histoire, Géographie, Sports, ..."
              />
            </Helmet>
            <Outlet />
          </MessageProvider>
        </ThemeProvider>
      </RealtimeProvider>
    </AppProvider>
  );
};
