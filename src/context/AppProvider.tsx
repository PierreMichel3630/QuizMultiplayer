import { createContext, useContext, useEffect, useState } from "react";
import { selectFriend } from "src/api/friend";
import { Friend } from "src/models/Friend";
import { useAuth } from "./AuthProviderSupabase";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  friends: Array<Friend>;
  refreshFriends: () => void;
}>({
  friends: [],
  refreshFriends: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Array<Friend>>([]);

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

  return (
    <AppContext.Provider
      value={{
        friends,
        refreshFriends,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
