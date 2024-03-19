import i18next from "i18next";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { LANGUAGES, Language } from "src/models/Language";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export const UserContext = createContext<{
  uuid: string;
  setUuid: (uuid: string) => void;
  username: string;
  setUsername: (username: string) => void;
  language: Language;
  languages: Array<Language>;
  setLanguage: (language: Language) => void;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  uuid:
    localStorage.getItem("uuid") !== null
      ? (localStorage.getItem("uuid")! as string)
      : crypto.randomUUID(),
  setUuid: (uuid: string) => {},
  username: "Player 1",
  setUsername: (username: string) => {},
  language:
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : LANGUAGES[0],
  languages: [],
  setLanguage: (language: Language) => {},
  mode: "light",
  setMode: (mode: "light" | "dark") => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: Props) => {
  const [uuid, setUuid] = useState(
    localStorage.getItem("uuid") !== null
      ? (localStorage.getItem("uuid")! as string)
      : crypto.randomUUID()
  );
  const getDefaultLanguage = () => {
    let result: undefined | Language = undefined;
    if (navigator.languages.length > 0) {
      const languageBrower = navigator.languages[0].split(/-|_/)[0];

      result = LANGUAGES.find((el) => el.browser === languageBrower);
    }
    return result ?? LANGUAGES[0];
  };
  const getLanguage = () =>
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : getDefaultLanguage();

  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("mode") !== null
      ? (localStorage.getItem("mode")! as "light" | "dark")
      : "dark"
  );

  const [language, setLanguage] = useState<Language>(getLanguage());
  const [username, setUsername] = useState(
    localStorage.getItem("username") !== null
      ? (localStorage.getItem("username")! as string)
      : ""
  );

  useEffect(() => {
    if (language) {
      moment.locale(language.iso);
      changeLanguage(language.iso);
      localStorage.setItem("language", JSON.stringify(language));
    }
  }, [language]);

  const changeLanguage = async (language: string) => {
    await i18next.changeLanguage(language);
  };

  useEffect(() => {
    localStorage.setItem("uuid", uuid);
  }, [uuid]);

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  return (
    <UserContext.Provider
      value={{
        uuid,
        setUuid,
        username,
        setUsername,
        languages: LANGUAGES,
        language,
        setLanguage,
        setMode,
        mode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
