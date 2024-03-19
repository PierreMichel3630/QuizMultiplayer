export interface Profile {
  id: string;
  username: string;
  avatar: string;
  created_at: Date;
  last_seen_friend: Date;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  avatar?: string | null;
  last_seen_friend?: Date;
}
