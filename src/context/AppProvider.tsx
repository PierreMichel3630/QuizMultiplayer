import { createContext, useContext, useEffect, useState } from "react";
import { selectFriend } from "src/api/friend";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { useAuth } from "./AuthProviderSupabase";
import { selectThemes } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { Country } from "src/models/Country";
import { selectCountries } from "src/api/country";
import { Category } from "src/models/Category";
import { selectCategories } from "src/api/category";
import { Favorite } from "src/models/Favorite";
import { selectMyFavorite } from "src/api/favorite";
import { ReportMessage } from "src/models/Report";
import { selectReportMessage } from "src/api/report";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  friends: Array<Friend>;
  refreshFriends: () => void;
  themes: Array<Theme>;
  refreshThemes: () => void;
  favorites: Array<Favorite>;
  refreshFavorites: () => void;
  categories: Array<Category>;
  countries: Array<Country>;
  reportmessages: Array<ReportMessage>;
}>({
  friends: [],
  refreshFriends: () => {},
  favorites: [],
  refreshFavorites: () => {},
  themes: [],
  refreshThemes: () => {},
  categories: [],
  countries: [],
  reportmessages: [],
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [reportmessages, setReportmessages] = useState<Array<ReportMessage>>(
    []
  );

  const getFavorite = () => {
    if (user !== null) {
      selectMyFavorite(user.id).then(({ data }) => {
        setFavorites(data as Array<Favorite>);
      });
    }
  };
  const refreshFavorites = () => {
    getFavorite();
  };

  useEffect(() => {
    getFavorite();
  }, [user]);

  const getFriends = async () => {
    if (user !== null) {
      const { data } = await selectFriend();
      const friends = data as Array<Friend>;
      setFriends(friends.filter((el) => el.status !== FRIENDSTATUS.REFUSE));
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
  const refreshThemes = () => {
    getThemes();
  };

  const getCategories = () => {
    selectCategories().then((res) => {
      if (res.data) setCategories(res.data as Array<Category>);
    });
  };

  const getCountries = () => {
    selectCountries().then((res) => {
      setCountries(res.data as Array<Country>);
    });
  };

  const getMessage = () => {
    selectReportMessage().then((res) => {
      setReportmessages(res.data as Array<ReportMessage>);
    });
  };

  useEffect(() => {
    getCategories();
    getCountries();
    getThemes();
    getMessage();
  }, []);

  return (
    <AppContext.Provider
      value={{
        friends,
        refreshFriends,
        themes,
        refreshThemes,
        countries,
        favorites,
        refreshFavorites,
        categories,
        reportmessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
