import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { important, px } from "csx";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import "../App.css";
import "../i18n/config";
import { useUser } from "src/context/UserProvider";
import { Colors } from "./Colors";
import { MessageProvider } from "src/context/MessageProvider";
import Routes from "../routes";
import ScrollToTop from "src/component/navigation/ScrollToTop";

export const ThemeBlock = () => {
  const { mode } = useUser();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: Colors.black,
                  contrastText: Colors.white,
                },
                secondary: {
                  main: Colors.colorApp,
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
              }
            : {
                primary: {
                  main: Colors.white,
                  contrastText: Colors.white,
                },
                secondary: {
                  main: Colors.colorApp,
                  contrastText: Colors.white,
                },
                text: {
                  primary: Colors.white,
                  secondary: Colors.white,
                },
                success: {
                  main: Colors.green,
                  contrastText: Colors.white,
                },
              }),
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
                color: mode === "light" ? Colors.greyLightMode : Colors.white,
                "&.Mui-selected": {
                  color: Colors.colorApp,
                },
              },
              label: {
                fontSize: "0.75rem",
                "&.Mui-selected": {
                  fontSize: "0.75rem",
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
          MuiRadio: {
            styleOverrides: {
              root: {
                color: "inherit",
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                color: "inherit",
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                minHeight: important(px(62)),
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
            lineHeight: 1,
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
            fontSize: 24,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 22,
            },
          },
          h3: {
            fontSize: 18,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 16,
            },
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
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <CssBaseline />
        <BrowserRouter>
          <ScrollToTop />
          <Routes />
        </BrowserRouter>
      </MessageProvider>
    </ThemeProvider>
  );
};
