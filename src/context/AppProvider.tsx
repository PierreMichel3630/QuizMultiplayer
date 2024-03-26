import { createContext, useContext, useEffect, useState } from "react";
import { selectFriend } from "src/api/friend";
import { Friend } from "src/models/Friend";
import { useAuth } from "./AuthProviderSupabase";
import { selectThemes } from "src/api/theme";
import { Theme } from "src/models/Theme";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  friends: Array<Friend>;
  refreshFriends: () => void;
  themes: Array<Theme>;
}>({
  friends: [],
  refreshFriends: () => {},
  themes: [],
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getFriends = async () => {
    if (user !== null) {
      const { data } = await selectFriend();
      const friends = data as Array<Friend>;
      setFriends(friends);
    }
  };
  const refreshFriends = () => {
    getFriends();
  };

  useEffect(() => {
    getFriends();
  }, [user]);

  const getThemes = () => {
    selectThemes().then((res) => {
      if (res.data) setThemes(res.data as Array<Theme>);
    });
  };

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <AppContext.Provider
      value={{
        friends,
        refreshFriends,
        themes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
