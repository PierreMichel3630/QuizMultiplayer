import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const URLPROD = "https://intinerairedemavie.web.app";
const URLLOCAL = "http://localhost:5173";

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: URLLOCAL },
  });

export const signUpWithEmail = (
  email: string,
  password: string,
  username: string,
  avatar: number
) =>
  supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        avatar,
      },
    },
  });

export const signInWithEmail = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const updatePassword = (password: string) =>
  supabase.auth.updateUser({ password: password });

export const signOut = () => supabase.auth.signOut();

export const passwordReset = (email: string) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${URLLOCAL}/resetpassword`,
  });
