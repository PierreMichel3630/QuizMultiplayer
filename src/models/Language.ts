export interface Language {
  iso: string;
  browser: string;
  name: string;
  icon: string;
}

export const LANGUAGES: Array<Language> = [
  {
    iso: "fr-FR",
    browser: "fr",
    name: "Français",
    icon: "https://flagcdn.com/w80/fr.png",
  },
  {
    iso: "en-US",
    browser: "en",
    name: "English",
    icon: "https://flagcdn.com/w80/gb.png",
  },
  /*{
    iso: "es-ES",
    browser: "es",
    name: "Español",
    icon: "https://flagcdn.com/w80/es.png",
  },
  {
    iso: "it-IT",
    browser: "it",
    name: "Italiano",
    icon: "https://flagcdn.com/w80/it.png",
  },
  {
    iso: "de-DE",
    browser: "de",
    name: "Deutsch",
    icon: "https://flagcdn.com/w80/de.png",
  },*/
];

export interface JsonLanguage {
  [iso: string]: string;
}

export interface JsonLanguageArray {
  [iso: string]: Array<string>;
}

export interface JsonLanguageArrayOrString {
  [iso: string]: Array<string> | string;
}
