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
import {
  getProfilById,
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
import { Profile } from "src/models/Profile";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AuthContext = createContext<{
  user: User | null;
  profile: Profile | null;
  streak: undefined | number;
  setStreak: (value: undefined | number) => void;
  setProfile: (value: Profile) => void;
  refreshProfil: () => void;
  login: (email: string, password: string) => Promise<AuthTokenResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
  deleteAccount: () => void;
  passwordReset: (
    email: string
  ) => Promise<
    { data: object; error: null } | { data: null; error: AuthError }
  >;
  updatePassword: (password: string) => Promise<UserResponse>;
}>({
  user:
    localStorage.getItem("user") !== null
      ? (JSON.parse(localStorage.getItem("user")!) as User)
      : null,
  streak: undefined,
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<undefined | number>(undefined);

  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") !== null
      ? (JSON.parse(localStorage.getItem("user")!) as User)
      : null
  );

  const login = (email: string, password: string) =>
    signInWithEmail(email, password);

  useEffect(() => {
    const getProfilUser = async () => {
      if (user) {
        getProfilById(user.id).then(({ data }) => {
          const res = data as Profile;
          setProfile(res);
          updateProfilByFunction().then(({ data }) => {
            if (data !== null) {
              setStreak(data.streak);
            }
          });
        });
      }
    };
    localStorage.setItem("user", JSON.stringify(user));
    getProfilUser();
  }, [user]);

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
        if (session !== null) {
          updateProfil({
            id: session.user.id,
            isonline: true,
            lastconnection: moment(),
          }).then(() => {
            setUser(session.user);
          });
        } else {
          setProfile(null);
          setUser(null);
          setStreak(undefined);
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
      getProfilById(profile.id).then(({ data }) => {
        setProfile(data as Profile);
      });
    }
  }, [profile]);

  const value = useMemo(
    () => ({
      streak,
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
    }),
    [deleteAccount, logout, profile, refreshProfil, streak, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
