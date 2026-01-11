import { AppBar, Box, Slide, Toolbar, useScrollTrigger } from "@mui/material";
import { ReactElement, useEffect, useMemo } from "react";
import { useAppBar } from "src/context/AppBarProvider";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { Colors } from "src/style/Colors";
import { Header } from "../header/Header";
import { DefaultToolbar } from "../toolbar/Toolbar";
import { useUser } from "src/context/UserProvider";

interface Props {
  children?: ReactElement<unknown>;
  setAppBarVisible: (v: boolean) => void;
}

const HideOnScroll = (props: Props) => {
  const { children, setAppBarVisible } = props;

  const trigger = useScrollTrigger();

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
  const { setAppBarVisible } = useAppBar();

  return (
    <>
      {isMobileOrTablet ? (
        <>
          <HideOnScroll setAppBarVisible={setAppBarVisible}>
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
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
