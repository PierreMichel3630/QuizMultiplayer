export interface Player {
  username: string;
  uuid: string;
  score: number;
  presence_ref: string;
}

export interface PlayerScore {
  id: number;
  username: string;
  uuid: string;
  score: number;
  position?: number;
}

export interface PlayerResponse {
  uuid: string;
  position?: number;
}
