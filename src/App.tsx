import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { updateProfil } from "./api/profile";
import { AppProvider } from "./context/AppProvider";
import { AuthProviderSupabase, useAuth } from "./context/AuthProviderSupabase";
import { UserProvider, useUser } from "./context/UserProvider";
import "./i18n/config";
import { ThemeBlock } from "./style/ThemeBlock";

function App() {
  const { language } = useUser();
  const { user } = useAuth();

  useEffect(() => {
    const handleUnload = async () => {
      if (user) {
        await updateProfil({ id: user.id, isonline: false });
      }
    };
    const handleVisibility = async () => {
      if (document.hidden) {
        if (user) {
          await updateProfil({ id: user.id, isonline: false });
        }
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user]);

  return (
    <AuthProviderSupabase>
      <UserProvider>
        <AppProvider>
          <Helmet
            htmlAttributes={{
              lang: language.iso,
            }}
          >
            <meta
              name="description"
              content="Testez vos connaissances. Jouez en Solo ou multijoueurs sur un quiz avec plus de 500 thèmes: Cinéma, Histoire, Géographie, Sports, ..."
            />
          </Helmet>
          <ThemeBlock />
        </AppProvider>
      </UserProvider>
    </AuthProviderSupabase>
  );
}

export default App;
