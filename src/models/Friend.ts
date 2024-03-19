import { Profile } from "./Profile";

export interface Friend {
  id: string;
  user1: Profile;
  user2: Profile;
  status: FRIENDSTATUS;
  created_at: Date;
}

export interface FriendNotJoin {
  id: string;
  user1: string;
  user2: string;
  status: FRIENDSTATUS;
  created_at: Date;
}

export interface FriendInsert {
  user1: string;
  user2: string;
}

export interface FriendUpdate {
  id: string;
  status: FRIENDSTATUS;
}

export enum FRIENDSTATUS {
  PROGRESS = "PROGRESS",
  VALID = "VALID",
  REFUSE = "REFUSE",
}
