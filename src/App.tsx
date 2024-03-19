import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import "./App.css";
import "./i18n/config";
import { Colors } from "./style/Colors";
import { Helmet } from "react-helmet-async";
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserProvider";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import { MessageProvider } from "./context/MessageProvider";

function App() {
  const { mode, language } = useUser();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: Colors.purple,
          },
          secondary: {
            main: Colors.white,
          },
          text: {
            primary: Colors.purple,
            secondary: Colors.grey2,
          },
        },
        typography: {
          fontFamily: ["Montserrat", "sans-serif"].join(","),
          h1: {
            fontFamily: ["Bowlby One SC", "sans-serif"].join(","),
            fontSize: 50,
            fontWeight: 700,
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
      </UserProvider>
    </AuthProviderSupabase>
  );
}

export default App;
