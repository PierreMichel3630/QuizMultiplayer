import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Banner } from "./Banner";
import { JsonLanguage } from "./Language";
import { Profile } from "./Profile";
import { Title } from "./Title";

export interface Accomplishment {
  id: number;
  label: JsonLanguage;
  title: Title | null;
  badge: Badge | null;
  avatar: Avatar | null;
  banner: Banner | null;
  value: number;
  champ: string;
  type: string;
  xp: number;
  gold: number;
}

export interface StatAccomplishment {
  profile: Profile;
  games: number;
  gamestenpts: number;
  gamestwentypts: number;
  gamesfiftypts: number;
  gameshundredpts: number;
  themetenpts: number;
  themetwentypts: number;
  duelgames: number;
  victoryduel: number;
  drawduel: number;
  defeatduel: number;
  xp: number;
}

export enum StatAccomplishmentEnum {
  games = "games",
  gamestenpts = "gamestenpts",
  gamestwentypts = "gamestwentypts",
  gamesfiftypts = "gamesfiftypts",
  gameshundredpts = "gameshundredpts",
  themetenpts = "themetenpts",
  themetwentypts = "themetwentypts",
  duelgames = "duelgames",
  victoryduel = "victoryduel",
  drawduel = "drawduel",
  defeatduel = "defeatduel",
}

export interface ProfileAccomplishment {
  id: number;
  profile: string;
  accomplishment: Accomplishment;
  validate: boolean;
}
