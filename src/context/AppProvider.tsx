import { groupBy, uniqBy } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  selectAccomplishment,
  selectMyAccomplishment,
} from "src/api/accomplishment";
import { selectAvatar } from "src/api/avatar";
import { selectBadgeByProfile, selectBadges } from "src/api/badge";
import { selectCategories } from "src/api/category";
import { selectCountries } from "src/api/country";
import { selectMyFavorite } from "src/api/favorite";
import { selectFriend } from "src/api/friend";
import { selectReportMessage } from "src/api/report";
import { selectThemes } from "src/api/theme";
import { selectTitleByProfile, selectTitles } from "src/api/title";
import {
  Accomplishment,
  ProfileAccomplishment,
} from "src/models/Accomplishment";
import { Avatar } from "src/models/Avatar";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Category, CategoryWithThemes } from "src/models/Category";
import { Country } from "src/models/Country";
import { Favorite } from "src/models/Favorite";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { ReportMessage } from "src/models/Report";
import { Theme } from "src/models/Theme";
import { Title, TitleProfile } from "src/models/Title";
import { sortByName } from "src/utils/sort";
import { useAuth } from "./AuthProviderSupabase";
import { useUser } from "./UserProvider";

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
  categories: Array<CategoryWithThemes>;
  categoriesAdmin: Array<Category>;
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
  nbQuestions?: number;
  nbThemes?: number;
  isLoadingTheme: boolean;
}>({
  friends: [],
  refreshFriends: () => {},
  favorites: [],
  refreshFavorites: () => {},
  themes: [],
  themesAdmin: [],
  getThemes: () => {},
  categories: [],
  categoriesAdmin: [],
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
  nbQuestions: undefined,
  nbThemes: undefined,
  isLoadingTheme: true,
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const { language } = useUser();

  const [nbQuestions, setNbQuestions] = useState<undefined | number>(undefined);
  const [nbThemes, setNbThemes] = useState<undefined | number>(undefined);
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
  const [categoriesAdmin, setCategoriesAdmin] = useState<Array<Category>>([]);
  const [categories, setCategories] = useState<Array<CategoryWithThemes>>([]);
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [reportmessages, setReportmessages] = useState<Array<ReportMessage>>(
    []
  );
  const [myaccomplishments, setMyaccomplishments] = useState<Array<number>>([]);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

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
    setIsLoadingTheme(true);
    selectThemes().then((res) => {
      if (res.data) {
        const resultats = (res.data as Array<Theme>).sort((a, b) =>
          sortByName(language, a, b)
        );
        const filterResultats = [...resultats].filter((el) => el.enabled);
        const uniqTheme = uniqBy(filterResultats, (el) => el.id);
        const count = uniqTheme.length;
        const questions = uniqTheme
          .filter((el) => !el.isfirst)
          .reduce((acc, v) => acc + v.questions, 0);
        setNbThemes(count);
        setNbQuestions(questions);
        setThemesAdmin(resultats);
        setThemes(filterResultats);
        setIsLoadingTheme(false);
      }
    });
  }, [language]);

  useEffect(() => {
    if (themes.length > 0) {
      const categories = uniqBy(
        themes.map((el) => el.category),
        (el) => el.id
      );
      const themesByCategorie = groupBy(themes, "category.id");
      const result = categories.map((el) => {
        const themes = themesByCategorie[el.id];
        return { ...el, themes };
      });
      setCategories(result);
    }
  }, [themes]);

  const refreshCategories = () => {
    getCategoriesAdmin();
  };

  const getCategoriesAdmin = () => {
    selectCategories().then((res) => {
      if (res.data) setCategoriesAdmin(res.data as Array<Category>);
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
    getCategoriesAdmin();
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
        nbQuestions,
        nbThemes,
        friends,
        refreshFriends,
        themes,
        themesAdmin,
        getThemes,
        countries,
        favorites,
        refreshFavorites,
        categories,
        categoriesAdmin,
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
        isLoadingTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
