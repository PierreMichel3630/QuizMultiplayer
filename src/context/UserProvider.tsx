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
  sound: number;
  setSound: (value: number) => void;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  uuid:
    localStorage.getItem("uuid") !== null
      ? (localStorage.getItem("uuid")! as string)
      : crypto.randomUUID(),
  setUuid: () => {},
  username: "Player 1",
  setUsername: () => {},
  language:
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : LANGUAGES[0],
  languages: [],
  setLanguage: () => {},
  sound: 20,
  setSound: () => {},
  mode: "light",
  setMode: () => {},
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
      : "light"
  );

  const [language, setLanguage] = useState<Language>(getLanguage());
  const [sound, setSound] = useState<number>(
    localStorage.getItem("sound") !== null
      ? Number(localStorage.getItem("sound")!)
      : 20
  );
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

  useEffect(() => {
    localStorage.setItem("sound", sound.toString());
  }, [sound]);

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
        sound,
        setSound,
        setMode,
        mode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
