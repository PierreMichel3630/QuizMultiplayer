export interface Profile {
  id: string;
  firstname: string;
  lastname: string;
  avatar: string;
  ispublic: boolean;
  country: number | null;
  created_at: Date;
  last_seen_travel: Date;
  last_seen_friend: Date;
}

export interface ProfileUpdate {
  id: string;
  firstname?: string;
  lastname?: string;
  ispublic?: boolean;
  country?: number | null;
  avatar?: string | null;
  last_seen_travel?: Date;
  last_seen_friend?: Date;
}
