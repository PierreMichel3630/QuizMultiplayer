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
  selectAccomplishmentByProfile,
} from "src/api/accomplishment";
import { selectAvatar, selectAvatarByProfile } from "src/api/avatar";
import { selectBadgeByProfile, selectBadges } from "src/api/badge";
import { selectCategories } from "src/api/category";
import { selectCountries } from "src/api/country";
import { selectMyFavorite } from "src/api/favorite";
import { selectFriendByProfileId } from "src/api/friend";
import { selectReportMessage } from "src/api/report";
import { selectThemes } from "src/api/theme";
import { selectTitleByProfile, selectTitles } from "src/api/title";
import {
  Accomplishment,
  ProfileAccomplishment,
} from "src/models/Accomplishment";
import { Avatar, AvatarProfile } from "src/models/Avatar";
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
import { Banner, BannerProfile } from "src/models/Banner";
import { selectBannerByProfile, selectBanners } from "src/api/banner";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  friends: Array<Friend>;
  getFriends: () => void;
  themes: Array<Theme>;
  themesAdmin: Array<Theme>;
  getThemes: () => void;
  favorites: Array<Favorite>;
  refreshFavorites: () => void;
  categories: Array<CategoryWithThemes>;
  isLoadingCategories: boolean;
  categoriesAdmin: Array<Category>;
  refreshCategories: () => void;
  countries: Array<Country>;
  reportmessages: Array<ReportMessage>;
  accomplishments: Array<Accomplishment>;
  getAccomplishments: () => void;
  myaccomplishments: Array<ProfileAccomplishment>;
  getMyAccomplishments: () => void;
  avatars: Array<Avatar>;
  getAvatars: () => void;
  myavatars: Array<Avatar>;
  getMyAvatars: () => void;
  badges: Array<Badge>;
  getBadges: () => void;
  mybadges: Array<Badge>;
  getMyBadges: () => void;
  banners: Array<Banner>;
  getBanners: () => void;
  mybanners: Array<Banner>;
  getMyBanners: () => void;
  titles: Array<Title>;
  getTitles: () => void;
  mytitles: Array<Title>;
  getMyTitles: () => void;
  nbQuestions?: number;
  nbThemes?: number;
  isLoadingTheme: boolean;
}>({
  friends: [],
  getFriends: () => {},
  favorites: [],
  refreshFavorites: () => {},
  themes: [],
  themesAdmin: [],
  getThemes: () => {},
  categories: [],
  isLoadingCategories: true,
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
  myavatars: [],
  getMyAvatars: () => {},
  badges: [],
  getBadges: () => {},
  mybadges: [],
  getMyBadges: () => {},
  banners: [],
  getBanners: () => {},
  mybanners: [],
  getMyBanners: () => {},
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
  const { user, profile } = useAuth();
  const { language } = useUser();

  const [nbQuestions, setNbQuestions] = useState<undefined | number>(undefined);
  const [nbThemes, setNbThemes] = useState<undefined | number>(undefined);
  const [avatars, setAvatars] = useState<Array<Avatar>>([]);
  const [myavatars, setMyAvatars] = useState<Array<Avatar>>([]);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [mybadges, setMyBadges] = useState<Array<Badge>>([]);
  const [banners, setBanners] = useState<Array<Banner>>([]);
  const [mybanners, setMybanners] = useState<Array<Banner>>([]);
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
  const [myaccomplishments, setMyaccomplishments] = useState<
    Array<ProfileAccomplishment>
  >([]);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const getFavorite = useCallback(() => {
    if (user !== null) {
      selectMyFavorite(user.id).then(({ data }) => {
        const value = data !== null ? (data as Array<Favorite>) : [];
        setFavorites(value);
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
      selectFriendByProfileId(user.id).then(({ data }) => {
        const value = data !== null ? (data as Array<Friend>) : [];
        setFriends(value.filter((el) => el.status !== FRIENDSTATUS.REFUSE));
      });
    }
  }, [user]);

  const getThemes = useCallback(() => {
    setIsLoadingTheme(true);
    setIsLoadingCategories(true);
    selectThemes().then(({ data }) => {
      if (data) {
        const value = data !== null ? (data as Array<Theme>) : [];
        const resultats = value.sort((a, b) => sortByName(language, a, b));
        const filterResultats =
          profile && profile.isadmin
            ? [...resultats]
            : [...resultats].filter((el) => el.enabled);
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
  }, [language, profile]);

  useEffect(() => {
    if (themes.length > 0) {
      const categories = uniqBy(
        themes.map((el) => el.category),
        (el) => el.id
      );
      const themesByCategorie = groupBy(themes, "category.id");
      const result = categories
        .sort((a, b) => sortByName(language, a, b))
        .map((el) => {
          const themes = themesByCategorie[el.id];
          return { ...el, themes };
        });
      setCategories(result);
      setIsLoadingCategories(false);
    }
  }, [themes, language]);

  const refreshCategories = () => {
    getCategoriesAdmin();
  };

  const getCategoriesAdmin = () => {
    selectCategories().then(({ data }) => {
      const value = data !== null ? (data as Array<Category>) : [];
      setCategoriesAdmin(value);
    });
  };

  const getAvatars = () => {
    selectAvatar().then(({ data }) => {
      const value = data !== null ? (data as Array<Avatar>) : [];
      setAvatars(value);
    });
  };

  const getTitles = () => {
    selectTitles().then(({ data }) => {
      const value = data !== null ? (data as Array<Title>) : [];
      setTitles(value);
    });
  };

  const getBadges = () => {
    selectBadges().then(({ data }) => {
      const value = data !== null ? (data as Array<Badge>) : [];
      setBadges(value);
    });
  };

  const getBanners = () => {
    selectBanners().then(({ data }) => {
      const value = data !== null ? (data as Array<Banner>) : [];
      setBanners(value);
    });
  };

  const getCountries = () => {
    selectCountries().then(({ data }) => {
      const value = data !== null ? (data as Array<Country>) : [];
      setCountries(value);
    });
  };

  const getMessage = () => {
    selectReportMessage().then(({ data }) => {
      const value = data !== null ? (data as Array<ReportMessage>) : [];
      setReportmessages(value);
    });
  };

  const getAccomplishments = () => {
    selectAccomplishment().then(({ data }) => {
      const value = data !== null ? (data as Array<Accomplishment>) : [];
      setAccomplishments(value);
    });
  };

  const getMyBadges = useCallback(() => {
    if (user) {
      selectBadgeByProfile(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<BadgeProfile>) : [];
        setMyBadges(res.map((el) => el.badge));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyBadges();
  }, [getMyBadges, user]);

  const getMyAvatars = useCallback(() => {
    if (user) {
      selectAvatarByProfile(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<AvatarProfile>) : [];
        setMyAvatars(res.map((el) => el.avatar));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyAvatars();
  }, [getMyAvatars, user]);

  const getMyBanners = useCallback(() => {
    if (user) {
      selectBannerByProfile(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<BannerProfile>) : [];
        setMybanners(res.map((el) => el.banner));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyBanners();
  }, [getMyBanners, user]);

  const getMyTitles = useCallback(() => {
    if (user) {
      selectTitleByProfile(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<TitleProfile>) : [];
        setMyTitles(res.map((el) => el.title));
      });
    }
  }, [user]);

  useEffect(() => {
    getMyTitles();
  }, [getMyTitles, user]);

  const getMyAccomplishments = useCallback(() => {
    if (user) {
      selectAccomplishmentByProfile(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<ProfileAccomplishment>) : [];
        setMyaccomplishments(res);
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
    getFriends();
    getBanners();
  }, [getFriends, getThemes]);

  return (
    <AppContext.Provider
      value={{
        nbQuestions,
        nbThemes,
        friends,
        getFriends,
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
        myavatars,
        getMyAvatars,
        badges,
        getBadges,
        mybadges,
        getMyBadges,
        banners,
        getBanners,
        mybanners,
        getMyBanners,
        titles,
        getTitles,
        mytitles,
        getMyTitles,
        isLoadingTheme,
        isLoadingCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
