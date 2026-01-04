import { Moment } from "moment";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Banner } from "./Banner";
import { Country } from "./Country";
import { TitleProfile } from "./Title";

export interface Profile {
  id: string;
  username: string;
  color: string;
  country: null | Country;
  avatar: Avatar;
  badge: null | Badge;
  titleprofile: null | TitleProfile;
  banner: null | Banner;
  money: number;
  created_at: Date;
  last_seen_friend: Date;
  isadmin: boolean;
  isonline: boolean;
  wheellaunch: Date;
  datevote: Date;
  lastconnection: Date;
  streak: number;
  lastchallengeplay: Date;
  lastplay: Date;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  title?: number | null;
  avatar?: number | null;
  last_seen_friend?: Date;
  isonline?: boolean;
  lastconnection?: Moment;
  lastchallengeplay?: string;
}
