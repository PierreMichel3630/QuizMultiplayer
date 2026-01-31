import { createContext, useContext, useMemo, useState } from "react";
import {
  headerSizeNoUser,
  headerSizePC,
  headerSizeUser,
} from "src/utils/config";
import { useAuth } from "./AuthProviderSupabase";
import { useIsMobileOrTablet } from "src/hook/useSize";
import { DrawerSize } from "src/models/enum/DrawerSize";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppBarContext = createContext<{
  top: number;
  appBarVisible: boolean;
  setAppBarVisible: (v: boolean) => void;
  openDrawer: boolean;
  toogleOpenDrawer: () => void;
  sizeDrawer: DrawerSize;
  toogleSizeDrawer: () => void;
}>({
  top: 0,
  appBarVisible: true,
  setAppBarVisible: () => {},
  openDrawer: false,
  toogleOpenDrawer: () => {},
  sizeDrawer: DrawerSize.MEDIUM,
  toogleSizeDrawer: () => {},
});

export const useAppBar = () => useContext(AppBarContext);

export const AppBarProvider = ({ children }: Props) => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { user } = useAuth();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sizeDrawer, setSizeDrawer] = useState<DrawerSize>(DrawerSize.MEDIUM);
  const [appBarVisible, setAppBarVisible] = useState(true);

  const headerSize = useMemo(() => {
    const sizeMobile = user === null ? headerSizeNoUser : headerSizeUser;
    const sizePC = headerSizePC;
    return isMobileOrTablet ? sizeMobile : sizePC;
  }, [isMobileOrTablet, user]);

  const toogleOpenDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const toogleSizeDrawer = () => {
    setSizeDrawer((prev) =>
      prev === DrawerSize.SMALL ? DrawerSize.MEDIUM : DrawerSize.SMALL,
    );
  };

  const value = useMemo(
    () => ({
      top: headerSize,
      appBarVisible,
      setAppBarVisible,
      openDrawer,
      toogleOpenDrawer,
      sizeDrawer,
      toogleSizeDrawer,
    }),
    [appBarVisible, headerSize, openDrawer, sizeDrawer],
  );

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  );
};
