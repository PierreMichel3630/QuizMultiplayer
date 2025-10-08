import i18next from "i18next";
import moment from "moment";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { selectChallengeByDateAndLanguage } from "src/api/challenge";
import { selectLanguages } from "src/api/language";
import { Language } from "src/models/Language";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export const UserContext = createContext<{
  uuid: string;
  setUuid: (uuid: string) => void;
  language?: Language;
  languages: Array<Language>;
  setLanguage: (language: Language) => void;
  sound: number;
  setSound: (value: number) => void;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  hasChallenge?: boolean;
}>({
  uuid:
    localStorage.getItem("uuid") !== null
      ? (localStorage.getItem("uuid")! as string)
      : crypto.randomUUID(),
  setUuid: () => {},
  language:
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : undefined,
  languages: [],
  setLanguage: () => {},
  sound: 20,
  setSound: () => {},
  mode: "dark",
  setMode: () => {},
  hasChallenge: undefined,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: Props) => {
  const [uuid, setUuid] = useState(
    localStorage.getItem("uuid") !== null
      ? (localStorage.getItem("uuid")! as string)
      : crypto.randomUUID()
  );

  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("mode") !== null
      ? (localStorage.getItem("mode")! as "light" | "dark")
      : "dark"
  );

  const [languages, setLanguages] = useState<Array<Language>>([]);
  const [language, setLanguage] = useState<Language | undefined>(undefined);
  const [sound, setSound] = useState<number>(
    localStorage.getItem("sound") !== null
      ? Number(localStorage.getItem("sound")!)
      : 20
  );
  const [hasChallenge, setHasChallenge] = useState<undefined | boolean>(
    undefined
  );

  useEffect(() => {
    selectLanguages().then(({ data }) => {
      setLanguages(data ?? []);
    });
  }, []);

  useEffect(() => {
    const getLanguage = () => {
      if (languages.length > 0) {
        let result: undefined | Language = undefined;
        if (navigator.languages.length > 0) {
          const languageBrower = navigator.languages[0].split(/-|_/)[0];

          result = languages.find((el) => el.browser === languageBrower);
        }
        setLanguage(result ?? languages[0]);
      }
    };

    if (localStorage.getItem("language") !== null) {
      const newLanguage = JSON.parse(
        localStorage.getItem("language")!
      ) as Language;
      if (newLanguage.id) {
        setLanguage(newLanguage);
      } else {
        getLanguage();
      }
    } else {
      getLanguage();
    }
  }, [languages]);

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
    localStorage.setItem("sound", sound.toString());
  }, [sound]);

  useEffect(() => {
    if (mode) {
      localStorage.setItem("mode", mode);
    } else {
      localStorage.removeItem("mode");
    }
  }, [mode]);

  useEffect(() => {
    if (language) {
      selectChallengeByDateAndLanguage(moment(), language.id).then(
        ({ data }) => {
          setHasChallenge(data !== null);
        }
      );
    }
  }, [language]);

  const value = useMemo(
    () => ({
      uuid,
      setUuid,
      languages,
      language,
      setLanguage,
      sound,
      setSound,
      setMode,
      mode,
      hasChallenge,
    }),
    [uuid, languages, language, sound, mode, hasChallenge]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
