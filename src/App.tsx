import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppProvider } from "./context/AppProvider";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import { MessageProvider } from "./context/MessageProvider";
import { UserProvider, useUser } from "./context/UserProvider";
import "./i18n/config";
import Routes from "./routes";
import { Colors } from "./style/Colors";

function App() {
  const { mode, language } = useUser();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: Colors.black,
            contrastText: Colors.white,
          },
          secondary: {
            main: Colors.blue3,
            contrastText: Colors.white,
          },
          text: {
            primary: Colors.black,
            secondary: Colors.white,
          },
          success: {
            main: Colors.green,
            contrastText: Colors.white,
          },
        },
        components: {
          MuiBottomNavigation: {
            styleOverrides: {
              root: {
                backgroundColor: Colors.white,
              },
            },
          },
          MuiBottomNavigationAction: {
            styleOverrides: {
              root: {
                color: Colors.greyLightMode,
                "&.Mui-selected": {
                  color: Colors.blue3,
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
              outlined: {
                borderWidth: 2,
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: "inherit",
              },
            },
          },
        },
        typography: {
          fontFamily: ["Montserrat", "sans-serif"].join(","),
          h1: {
            fontFamily: ["Bowlby One SC", "sans-serif"].join(","),
            fontSize: 50,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 30,
            },
          },
          caption: {
            fontSize: 10,
            fontStyle: "italic",
            fontWeight: 500,
          },
          body1: {
            fontSize: 13,
            fontWeight: 500,
          },
          body2: {
            fontSize: 11,
            fontWeight: 700,
          },
          h2: {
            fontSize: 22,
            fontWeight: 700,
          },
          h3: {
            fontSize: 18,
            fontWeight: 700,
          },
          h4: {
            fontSize: 16,
            fontWeight: 700,
          },
          h6: {
            fontSize: 13,
            fontWeight: 600,
          },
        },
      }),
    [mode]
  );

  return (
    <AuthProviderSupabase>
      <UserProvider>
        <AppProvider>
          <Helmet
            htmlAttributes={{
              lang: language.iso,
            }}
          />
          <ThemeProvider theme={theme}>
            <MessageProvider>
              <CssBaseline />
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </MessageProvider>
          </ThemeProvider>
        </AppProvider>
      </UserProvider>
    </AuthProviderSupabase>
  );
}

export default App;
