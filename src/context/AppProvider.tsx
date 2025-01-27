import { groupBy, uniqBy } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { selectAccomplishmentByProfile } from "src/api/accomplishment";
import { selectAvatarByProfile } from "src/api/avatar";
import { selectBadgeByProfile } from "src/api/badge";
import { selectBannerByProfile } from "src/api/banner";
import { selectCategories } from "src/api/category";
import { selectMyFavorite } from "src/api/favorite";
import { selectFriendByProfileId } from "src/api/friend";
import { countPlayers } from "src/api/profile";
import { selectReportMessage } from "src/api/report";
import { selectThemes } from "src/api/theme";
import { selectTitleByProfile } from "src/api/title";
import { ProfileAccomplishment } from "src/models/Accomplishment";
import { Avatar, AvatarProfile } from "src/models/Avatar";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Banner, BannerProfile } from "src/models/Banner";
import { Category, CategoryWithThemes } from "src/models/Category";
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
  reportmessages: Array<ReportMessage>;
  myaccomplishments: Array<ProfileAccomplishment>;
  getMyAccomplishments: () => void;
  myAvatars: Array<Avatar>;
  getMyAvatars: () => void;
  myBadges: Array<Badge>;
  getMyBadges: () => void;
  mybanners: Array<Banner>;
  getMyBanners: () => void;
  myTitles: Array<Title>;
  getMyTitles: () => void;
  nbQuestions?: number;
  nbThemes?: number;
  nbPlayers?: number;
  isLoadingTheme: boolean;
  headerSize: number;
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
  reportmessages: [],
  myaccomplishments: [],
  getMyAccomplishments: () => {},
  myAvatars: [],
  getMyAvatars: () => {},
  myBadges: [],
  getMyBadges: () => {},
  mybanners: [],
  getMyBanners: () => {},
  myTitles: [],
  getMyTitles: () => {},
  nbQuestions: undefined,
  nbThemes: undefined,
  nbPlayers: undefined,
  isLoadingTheme: true,
  headerSize: 77,
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user, profile } = useAuth();
  const { language } = useUser();

  const [nbQuestions, setNbQuestions] = useState<undefined | number>(undefined);
  const [nbThemes, setNbThemes] = useState<undefined | number>(undefined);
  const [nbPlayers, setNbPlayers] = useState<undefined | number>(undefined);
  const [myAvatars, setMyAvatars] = useState<Array<Avatar>>([]);
  const [myBadges, setMyBadges] = useState<Array<Badge>>([]);
  const [mybanners, setMybanners] = useState<Array<Banner>>([]);
  const [myTitles, setMyTitles] = useState<Array<Title>>([]);
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [themesAdmin, setThemesAdmin] = useState<Array<Theme>>([]);
  const [categoriesAdmin, setCategoriesAdmin] = useState<Array<Category>>([]);
  const [categories, setCategories] = useState<Array<CategoryWithThemes>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [reportmessages, setReportmessages] = useState<Array<ReportMessage>>(
    []
  );
  const [myaccomplishments, setMyaccomplishments] = useState<
    Array<ProfileAccomplishment>
  >([]);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const headerSize = useMemo(() => (user ? 72 : 50), [user]);

  useEffect(() => {
    const getCountPlayer = () => {
      countPlayers().then(({ count }) => {
        setNbPlayers(count ?? undefined);
      });
    };
    getCountPlayer();
  }, []);

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
        const resultats = [...value].sort((a, b) => sortByName(language, a, b));
        const filterResultats = profile?.isadmin
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
      const result = [...categories]
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

  const getMessage = () => {
    selectReportMessage().then(({ data }) => {
      const value = data !== null ? (data as Array<ReportMessage>) : [];
      setReportmessages(value);
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
    getThemes();
    getMessage();
    getFriends();
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
        favorites,
        refreshFavorites,
        categories,
        categoriesAdmin,
        refreshCategories,
        reportmessages,
        myaccomplishments,
        getMyAccomplishments,
        myAvatars,
        getMyAvatars,
        myBadges,
        getMyBadges,
        mybanners,
        getMyBanners,
        myTitles,
        getMyTitles,
        isLoadingTheme,
        isLoadingCategories,
        headerSize,
        nbPlayers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
