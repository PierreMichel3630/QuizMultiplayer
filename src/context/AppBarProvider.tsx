import { createContext, useContext, useMemo, useState } from "react";
import {
  headerSizeNoUser,
  headerSizePC,
  headerSizeUser,
} from "src/utils/config";
import { useAuth } from "./AuthProviderSupabase";
import { useIsMobileOrTablet } from "src/hook/useSize";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppBarContext = createContext<{
  top: number;
  appBarVisible: boolean;
  setAppBarVisible: (v: boolean) => void;
  openDrawer: boolean;
  toogleOpenDrawer: () => void;
}>({
  top: 0,
  appBarVisible: true,
  setAppBarVisible: () => {},
  openDrawer: true,
  toogleOpenDrawer: () => {},
});

export const useAppBar = () => useContext(AppBarContext);

export const AppBarProvider = ({ children }: Props) => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { user } = useAuth();

  const [openDrawer, setOpenDrawer] = useState(true);
  const [appBarVisible, setAppBarVisible] = useState(true);

  const headerSize = useMemo(() => {
    const sizeMobile = user !== null ? headerSizeUser : headerSizeNoUser;
    const sizePC = headerSizePC;
    return isMobileOrTablet ? sizeMobile : sizePC;
  }, [isMobileOrTablet, user]);

  const top = useMemo(
    () => (appBarVisible ? headerSize : 0),
    [appBarVisible, headerSize]
  );

  const toogleOpenDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      top,
      appBarVisible,
      setAppBarVisible,
      openDrawer,
      toogleOpenDrawer,
    }),
    [appBarVisible, top, openDrawer]
  );

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  );
};
