import {
  AuthError,
  AuthTokenResponse,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProfilById, updateProfil } from "src/api/profile";
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
        await updateProfil({
          id: user.id,
          isonline: true,
          lastconnection: new Date(),
        });
      }
      if (user !== null) {
        const { data } = await getProfilById(user.id);
        setProfile(data as Profile);
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
        lastconnection: new Date(),
      });
    }
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
        setUser(session !== null ? session.user : null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
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
    [deleteAccount, logout, profile, refreshProfil, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
