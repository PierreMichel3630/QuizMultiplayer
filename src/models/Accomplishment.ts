import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { JsonLanguage } from "./Language";
import { Profile } from "./Profile";
import { Title } from "./Title";

export interface Accomplishment {
  id: number;
  label: JsonLanguage;
  title: Title | null;
  badge: Badge | null;
  avatar: Avatar | null;
  value: number;
  champ: string;
  type: string;
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
}

export interface ProfileAccomplishment {
  profile: string;
  accomplishment: number;
}
