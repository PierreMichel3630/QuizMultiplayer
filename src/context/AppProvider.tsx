import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import { useUser } from "./UserProvider";
import { sortByName } from "src/utils/sort";
import {
  Accomplishment,
  ProfileAccomplishment,
} from "src/models/Accomplishment";
import {
  selectAccomplishment,
  selectMyAccomplishment,
} from "src/api/accomplishment";
import { Avatar } from "src/models/Avatar";
import { selectAvatar } from "src/api/avatar";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Title, TitleProfile } from "src/models/Title";
import { selectBadgeByProfile, selectBadges } from "src/api/badge";
import { selectTitleByProfile, selectTitles } from "src/api/title";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  friends: Array<Friend>;
  refreshFriends: () => void;
  themes: Array<Theme>;
  themesAdmin: Array<Theme>;
  getThemes: () => void;
  favorites: Array<Favorite>;
  refreshFavorites: () => void;
  categories: Array<Category>;
  refreshCategories: () => void;
  countries: Array<Country>;
  reportmessages: Array<ReportMessage>;
  accomplishments: Array<Accomplishment>;
  getAccomplishments: () => void;
  myaccomplishments: Array<number>;
  getMyAccomplishments: () => void;
  avatars: Array<Avatar>;
  getAvatars: () => void;
  badges: Array<Badge>;
  getBadges: () => void;
  mybadges: Array<Badge>;
  getMyBadges: () => void;
  titles: Array<Title>;
  getTitles: () => void;
  mytitles: Array<Title>;
  getMyTitles: () => void;
}>({
  friends: [],
  refreshFriends: () => {},
  favorites: [],
  refreshFavorites: () => {},
  themes: [],
  themesAdmin: [],
  getThemes: () => {},
  categories: [],
  refreshCategories: () => {},
  countries: [],
  reportmessages: [],
  accomplishments: [],
  getAccomplishments: () => {},
  myaccomplishments: [],
  getMyAccomplishments: () => {},
  avatars: [],
  getAvatars: () => {},
  badges: [],
  getBadges: () => {},
  mybadges: [],
  getMyBadges: () => {},
  titles: [],
  getTitles: () => {},
  mytitles: [],
  getMyTitles: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const { language } = useUser();

  const [avatars, setAvatars] = useState<Array<Avatar>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [mybadges, setMyBadges] = useState<Array<Badge>>([]);
  const [titles, setTitles] = useState<Array<Title>>([]);
  const [mytitles, setMyTitles] = useState<Array<Title>>([]);
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [accomplishments, setAccomplishments] = useState<Array<Accomplishment>>(
    []
  );
  const [themesAdmin, setThemesAdmin] = useState<Array<Theme>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [reportmessages, setReportmessages] = useState<Array<ReportMessage>>(
    []
  );
  const [myaccomplishments, setMyaccomplishments] = useState<Array<number>>([]);

  const getFavorite = useCallback(() => {
    if (user !== null) {
      selectMyFavorite(user.id).then(({ data }) => {
        setFavorites(data as Array<Favorite>);
      });
    }
  }, [user]);

  const refreshFavorites = () => {
    getFavorite();
  };

  useEffect(() => {
    getFavorite();
  }, [getFavorite, user]);

  const getFriends = useCallback(() => {
    if (user !== null) {
      selectFriend().then(({ data }) => {
        const friends = data as Array<Friend>;
        setFriends(friends.filter((el) => el.status !== FRIENDSTATUS.REFUSE));
      });
    }
  }, [user]);

  const refreshFriends = () => {
    getFriends();
  };

  useEffect(() => {
    getFriends();
  }, [getFriends, user]);

  const getThemes = useCallback(() => {
    selectThemes().then((res) => {
      if (res.data) {
        const resultats = (res.data as Array<Theme>).sort((a, b) =>
          sortByName(language, a, b)
        );
        setThemesAdmin(resultats);
        setThemes(resultats.filter((el) => el.enabled));
      }
    });
  }, [language]);

  const refreshCategories = () => {
    getCategories();
  };

  const getCategories = () => {
    selectCategories().then((res) => {
      if (res.data) setCategories(res.data as Array<Category>);
    });
  };

  const getAvatars = () => {
    selectAvatar().then((res) => {
      if (res.data) setAvatars(res.data as Array<Avatar>);
    });
  };

  const getTitles = () => {
    selectTitles().then((res) => {
      if (res.data) setTitles(res.data as Array<Title>);
    });
  };

  const getBadges = () => {
    selectBadges().then((res) => {
      if (res.data) setBadges(res.data as Array<Badge>);
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

  const getAccomplishments = () => {
    selectAccomplishment().then(({ data }) => {
      setAccomplishments(data as Array<Accomplishment>);
    });
  };

  const getMyBadges = useCallback(() => {
    if (user) {
      selectTitleByProfile(user.id).then(({ data }) => {
        const res = data as Array<TitleProfile>;
        setMyTitles(res.map((el) => el.title));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyBadges();
  }, [getMyBadges, user]);

  const getMyTitles = useCallback(() => {
    if (user) {
      selectBadgeByProfile(user.id).then(({ data }) => {
        const res = data as Array<BadgeProfile>;
        setMyBadges(res.map((el) => el.badge));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyTitles();
  }, [getMyTitles, user]);

  const getMyAccomplishments = useCallback(() => {
    if (user) {
      selectMyAccomplishment(user.id).then(({ data }) => {
        const res = data as Array<ProfileAccomplishment>;
        setMyaccomplishments(res.map((el) => el.accomplishment));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyAccomplishments();
  }, [getMyAccomplishments, user]);

  useEffect(() => {
    getCategories();
    getCountries();
    getThemes();
    getMessage();
    getAccomplishments();
    getAvatars();
    getBadges();
    getTitles();
  }, [getThemes]);

  return (
    <AppContext.Provider
      value={{
        friends,
        refreshFriends,
        themes,
        themesAdmin,
        getThemes,
        countries,
        favorites,
        refreshFavorites,
        categories,
        refreshCategories,
        reportmessages,
        accomplishments,
        getAccomplishments,
        myaccomplishments,
        getMyAccomplishments,
        avatars,
        getAvatars,
        badges,
        getBadges,
        mybadges,
        getMyBadges,
        titles,
        getTitles,
        mytitles,
        getMyTitles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
