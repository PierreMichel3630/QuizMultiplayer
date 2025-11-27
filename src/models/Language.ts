export interface Language {
  id: number;
  iso: string;
  browser: string;
  name: string;
  icon: string;
  activate: boolean;
}

export interface JsonLanguage {
  [iso: string]: string;
}

export interface JsonLanguageArray {
  [iso: string]: Array<string>;
}

export interface JsonLanguageArrayOrString {
  [iso: string]: Array<string> | string;
}
