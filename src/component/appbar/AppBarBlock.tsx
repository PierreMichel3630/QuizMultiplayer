import { AppBar, Box, Slide, Toolbar, useScrollTrigger } from "@mui/material";
import { ReactElement, useEffect, useMemo } from "react";
import { useAppBar } from "src/context/AppBarProvider";
import { useUser } from "src/context/UserProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { Colors } from "src/style/Colors";
import { Header } from "../header/Header";
import { DefaultToolbar } from "../toolbar/Toolbar";

interface Props {
  children?: ReactElement<unknown>;
}

const HideOnScroll = (props: Props) => {
  const { children } = props;
  const { setAppBarVisible } = useAppBar();

  const trigger = useScrollTrigger({
    threshold: 300,
  });

  useEffect(() => {
    setAppBarVisible(!trigger);
  }, [setAppBarVisible, trigger]);

  return (
    <Slide appear={false} direction="down" timeout={350} in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
};

export const AppBarBlock = () => {
  const isMobileOrTablet = useIsMobileOrTablet();

  return (
    <>
      {isMobileOrTablet ? (
        <>
          <HideOnScroll>
            <Box>
              <AppBarDefault />
            </Box>
          </HideOnScroll>
          <DefaultToolbar />
        </>
      ) : (
        <>
          <AppBarDefault />
          <DefaultToolbar />
        </>
      )}
    </>
  );
};

const AppBarDefault = () => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) =>
          isMobileOrTablet ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          background: isDarkMode ? Colors.black : Colors.colorApp,
        }}
        disableGutters={isMobileOrTablet}
      >
        <Header />
      </Toolbar>
    </AppBar>
  );
};
