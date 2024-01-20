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
    icon: "https://flagcdn.com/fr.svg",
  },
  {
    iso: "en-US",
    browser: "en",
    name: "English",
    icon: "https://flagcdn.com/gb.svg",
  },
  /*{
    iso: "es",
    browser: "es",
    name: "Español",
    icon: "https://flagcdn.com/es.svg",
  },
  {
    iso: "it",
    browser: "it",
    name: "Italiano",
    icon: "https://flagcdn.com/it.svg",
  },
  {
    iso: "de",
    browser: "de",
    name: "Deutsch",
    icon: "https://flagcdn.com/de.svg",
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
