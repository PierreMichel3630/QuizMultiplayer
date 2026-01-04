export interface ComparePlayers {
  theme: CompareTheme;
  score_player1: ComparePlayerInfos | null;
  score_player2: ComparePlayerInfos | null;
  opposition: CompareOpposition | null;
}

export interface CompareTheme {
  id: number;
  color: string;
  image?: string;
  name: string;
}

export interface ComparePlayerInfos {
  duelgames: number;
  victory: number;
  draw: number;
  defeat: number;
  rank: number;
  games: number;
  points: number;
}

export interface CompareOpposition {
  games: number;
  victory: number;
  draw: number;
  defeat: number;
}
