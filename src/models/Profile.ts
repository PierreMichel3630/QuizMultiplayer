import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Title } from "./Title";

export interface Profile {
  id: string;
  username: string;
  color: string;
  country: null | number;
  avatar: Avatar;
  badge: null | Badge;
  title: null | Title;
  created_at: Date;
  last_seen_friend: Date;
  isadmin: boolean;
  isonline: boolean;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  title?: number | null;
  avatar?: number | null;
  last_seen_friend?: Date;
  isonline?: boolean;
}
