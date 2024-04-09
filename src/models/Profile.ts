export interface Profile {
  id: string;
  username: string;
  color: string;
  country: null | number;
  avatar: string;
  created_at: Date;
  last_seen_friend: Date;
  isadmin: boolean;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  avatar?: string | null;
  last_seen_friend?: Date;
}
