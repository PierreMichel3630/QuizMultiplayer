import { JsonLanguage } from "./Language";

export interface Title {
  id: number;
  name: JsonLanguage;
  price: number;
  isaccomplishment: boolean;
}

export interface TitleProfile {
  id: number;
  profile: string;
  title: Title;
  multiplicator: number | null;
}
