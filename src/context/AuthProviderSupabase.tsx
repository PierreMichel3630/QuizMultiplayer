import {
  AuthError,
  AuthTokenResponse,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import moment from "moment";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { countChallengeGameByDateAndProfileId } from "src/api/challenge";
import {
  selectProfilById,
  updateProfil,
  updateProfilByFunction,
} from "src/api/profile";
import {
  passwordReset,
  signInWithEmail,
  signOut,
  supabase,
  updatePassword,
} from "src/api/supabase";
import { deleteAccountUser } from "src/api/user";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Profile } from "src/models/Profile";
import { getLevel } from "src/utils/calcul";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AuthContext = createContext<{
  user: User | null;
  profile: Profile | null;
  level?: number;
  multicompte?: boolean;
  streak?: number;
  hasPlayChallenge: boolean;
  refreshHasPlayChallenge: () => void;
  setStreak: (value: undefined | number) => void;
  setProfile: (value: Profile) => void;
  refreshProfil: () => void;
  login: (email: string, password: string) => Promise<AuthTokenResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
  deleteAccount: () => void;
  passwordReset: (
    email: string,
  ) => Promise<
    { data: object; error: null } | { data: null; error: AuthError }
  >;
  updatePassword: (password: string) => Promise<UserResponse>;
}>({
  user:
    localStorage.getItem("user") === null
      ? null
      : (JSON.parse(localStorage.getItem("user")!) as User),
  multicompte: undefined,
  level: undefined,
  streak: undefined,
  hasPlayChallenge: false,
  refreshHasPlayChallenge: () => {},
  setStreak: () => {},
  deleteAccount: () => {},
  profile: null,
  setProfile: () => {},
  refreshProfil: () => {},
  login: (email: string, password: string) => signInWithEmail(email, password),
  logout: () => signOut(),
  passwordReset: (email: string) => passwordReset(email),
  updatePassword: (password: string) => updatePassword(password),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProviderSupabase = ({ children }: Props) => {
  const [hasPlayChallenge, setHasPlayChallenge] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<undefined | number>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") === null
      ? null
      : (JSON.parse(localStorage.getItem("user")!) as User),
  );

  const multicompte = useMemo(
    () => (profile === null || profile?.multicompte ? undefined : false),
    [profile],
  );
  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

  const login = (email: string, password: string) =>
    signInWithEmail(email, password);

  const getProfilUser = useCallback(async () => {
    if (user !== null) {
      selectProfilById(user.id).then(async ({ data }) => {
        const res = data as Profile;
        setProfile(res);
        const accounts = saveAccountConnect(res);

        const today = moment().format("YYYY-MM-DD");
        const lastPlay = moment(res.lastchallengeplay).format("YYYY-MM-DD");

        const diffDays = moment(today).diff(moment(lastPlay), "days");

        setStreak(diffDays > 1 ? 0 : res.streak);
        await updateProfilByFunction(accounts);
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    getProfilUser();
  }, [getProfilUser]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const saveAccountConnect = (profile: Profile) => {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

    if (!accounts.includes(profile.id)) {
      accounts.push(profile.id);
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
    return accounts;
  };

  const getMyStat = useCallback(() => {
    if (user) {
      selectStatAccomplishmentByProfile(user.id).then(({ data }) => {
        setStat(data as StatAccomplishment);
      });
    }
  }, [user]);

  useEffect(() => {
    getMyStat();
  }, [getMyStat]);

  const refreshHasPlayChallenge = useCallback(() => {
    if (user) {
      const date = moment();
      countChallengeGameByDateAndProfileId(date, user.id).then(({ count }) => {
        setHasPlayChallenge(count !== null && count > 0);
      });
    }
  }, [user]);

  useEffect(() => {
    refreshHasPlayChallenge();
  }, [refreshHasPlayChallenge]);

  const logout = useCallback(async () => {
    if (user) {
      await updateProfil({
        id: user.id,
        isonline: false,
        lastconnection: moment(),
      });
    }
    setUser(null);
    setProfile(null);
    setHasPlayChallenge(false);
    clearLocalStorage();
    return signOut();
  }, [user]);

  const clearLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (session === null) {
          setProfile(null);
          setUser(null);
          setStreak(undefined);
        } else {
          updateProfil({
            id: session.user.id,
            isonline: true,
            lastconnection: moment(),
          }).then(() => {
            setUser(session.user);
          });
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setStreak(undefined);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const deleteAccount = useCallback(async () => {
    await deleteAccountUser();
    clearLocalStorage();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfil = useCallback(() => {
    if (profile) {
      selectProfilById(profile.id).then(({ data }) => {
        setProfile(data as Profile);
      });
    }
  }, [profile]);

  const value = useMemo(
    () => ({
      streak,
      multicompte,
      level,
      setStreak,
      profile,
      setProfile,
      refreshProfil,
      user,
      login,
      logout,
      deleteAccount,
      passwordReset,
      updatePassword,
      hasPlayChallenge,
      refreshHasPlayChallenge,
    }),
    [
      deleteAccount,
      level,
      multicompte,
      hasPlayChallenge,
      refreshHasPlayChallenge,
      logout,
      profile,
      refreshProfil,
      streak,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
