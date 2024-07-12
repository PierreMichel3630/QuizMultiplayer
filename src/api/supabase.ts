import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const options = {
  global: { headers: { "Keep-Alive": "true" } },
};
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

const URLPROD = "https://quizup-v2.web.app";

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
    redirectTo: `${URLPROD}/resetpassword`,
  });
