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
import { selectMyFavorite } from "src/api/favorite";
import { selectFriendByProfileId } from "src/api/friend";
import { countPlayers } from "src/api/profile";
import { selectReportMessage } from "src/api/report";
import { countThemes } from "src/api/theme";
import { selectTitleByProfile } from "src/api/title";
import { ProfileAccomplishment } from "src/models/Accomplishment";
import { Avatar, AvatarProfile } from "src/models/Avatar";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Banner, BannerProfile } from "src/models/Banner";
import { Favorite } from "src/models/Favorite";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { ReportMessage } from "src/models/Report";
import { TitleProfile } from "src/models/Title";
import { headerSizeNoUser, headerSizeUser } from "src/utils/config";
import { sortByName } from "src/utils/sort";
import { useAuth } from "./AuthProviderSupabase";
import { useUser } from "./UserProvider";
import { Config } from "src/models/Config";
import { selectConfig } from "src/api/config";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  config?: Config;
  friends: Array<Friend>;
  idsFriend: Array<string>;
  getFriends: () => void;
  favorites: Array<Favorite>;
  getFavorite: () => void;
  reportmessages: Array<ReportMessage>;
  myaccomplishments: Array<ProfileAccomplishment>;
  getMyAccomplishments: () => void;
  myAvatars: Array<Avatar>;
  getMyAvatars: () => void;
  myBadges: Array<Badge>;
  getMyBadges: () => void;
  mybanners: Array<Banner>;
  getMyBanners: () => void;
  myTitles: Array<TitleProfile>;
  getMyTitles: () => void;
  nbQuestions?: number;
  nbThemes?: number;
  nbPlayers?: number;
  headerSize: number;
}>({
  config: undefined,
  friends: [],
  idsFriend: [],
  getFriends: () => {},
  favorites: [],
  getFavorite: () => {},
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
  nbThemes: undefined,
  nbPlayers: undefined,
  headerSize: headerSizeNoUser,
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const { language } = useUser();

  const [config, setConfig] = useState<undefined | Config>(undefined);
  const [nbThemes, setNbThemes] = useState<undefined | number>(undefined);
  const [nbPlayers, setNbPlayers] = useState<undefined | number>(undefined);
  const [myAvatars, setMyAvatars] = useState<Array<Avatar>>([]);
  const [myBadges, setMyBadges] = useState<Array<Badge>>([]);
  const [mybanners, setMybanners] = useState<Array<Banner>>([]);
  const [myTitles, setMyTitles] = useState<Array<TitleProfile>>([]);
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [reportmessages, setReportmessages] = useState<Array<ReportMessage>>(
    []
  );
  const [myaccomplishments, setMyaccomplishments] = useState<
    Array<ProfileAccomplishment>
  >([]);

  const headerSize = useMemo(
    () => (user ? headerSizeUser : headerSizeNoUser),
    [user]
  );

  const idsFriendAndMe = useMemo(
    () =>
      user
        ? [
            ...friends
              .filter((el) => el.status === FRIENDSTATUS.VALID)
              .reduce(
                (acc, value) =>
                  value.user2.id === user.id
                    ? [...acc, value.user1.id]
                    : [...acc, value.user2.id],
                [] as Array<string>
              ),
            user.id,
          ]
        : [],
    [friends, user]
  );

  useEffect(() => {
    const getConfig = () => {
      selectConfig().then(({ data }) => {
        setConfig(data ?? undefined);
      });
    };
    getConfig();
  }, []);

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
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    getFavorite();
  }, [getFavorite, user]);

  const getFriends = useCallback(() => {
    if (user !== null) {
      selectFriendByProfileId(user.id).then(({ data }) => {
        const value = data !== null ? (data as Array<Friend>) : [];
        setFriends(value.filter((el) => el.status !== FRIENDSTATUS.REFUSE));
      });
    } else {
      setFriends([]);
    }
  }, [user]);

  useEffect(() => {
    if (language) {
      countThemes(language, "").then(({ count }) => {
        setNbThemes(count ?? 0);
      });
    }
  }, [language]);

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
    } else {
      setMyBadges([]);
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
    } else {
      setMyAvatars([]);
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
    } else {
      setMybanners([]);
    }
  }, [user]);

  useEffect(() => {
    getMyBanners();
  }, [getMyBanners, user]);

  const getMyTitles = useCallback(() => {
    if (user) {
      selectTitleByProfile(user.id).then(({ data }) => {
        const res = data ?? [];
        setMyTitles(
          language
            ? [...res].sort((a, b) => sortByName(language, a.title, b.title))
            : [...res]
        );
      });
    } else {
      setMyTitles([]);
    }
  }, [user, language]);

  useEffect(() => {
    getMyTitles();
  }, [getMyTitles, user]);

  const getMyAccomplishments = useCallback(() => {
    if (user) {
      selectAccomplishmentByProfile(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<ProfileAccomplishment>) : [];
        setMyaccomplishments(res);
      });
    } else {
      setMyaccomplishments([]);
    }
  }, [user]);

  useEffect(() => {
    getMyAccomplishments();
  }, [getMyAccomplishments, user]);

  useEffect(() => {
    getMessage();
    getFriends();
  }, [getFriends]);

  const value = useMemo(
    () => ({
      config,
      nbThemes,
      friends,
      idsFriend: idsFriendAndMe,
      getFriends,
      favorites,
      getFavorite,
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
      headerSize,
      nbPlayers,
    }),
    [
      config,
      favorites,
      friends,
      idsFriendAndMe,
      getFriends,
      getMyAccomplishments,
      getMyAvatars,
      getMyBadges,
      getMyBanners,
      getMyTitles,
      headerSize,
      myAvatars,
      myBadges,
      myTitles,
      myaccomplishments,
      mybanners,
      nbPlayers,
      nbThemes,
      getFavorite,
      reportmessages,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
