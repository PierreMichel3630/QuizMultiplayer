import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Banner } from "./Banner";
import { Country } from "./Country";
import { Title } from "./Title";

export interface Profile {
  id: string;
  username: string;
  color: string;
  country: null | Country;
  avatar: Avatar;
  badge: null | Badge;
  title: null | Title;
  banner: null | Banner;
  money: number;
  created_at: Date;
  last_seen_friend: Date;
  isadmin: boolean;
  isonline: boolean;
  wheellaunch: Date;
  datevote: Date;
  lastconnection: Date;
  loginstreak: number;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  title?: number | null;
  avatar?: number | null;
  last_seen_friend?: Date;
  isonline?: boolean;
  lastconnection?: Date;
}
