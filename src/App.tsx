import { Helmet } from "react-helmet-async";
import { AppProvider } from "./context/AppProvider";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import { UserProvider, useUser } from "./context/UserProvider";
import "./i18n/config";
import { ThemeBlock } from "./style/ThemeBlock";

function App() {
  const { language } = useUser();

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
