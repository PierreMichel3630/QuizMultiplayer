export interface Game {
  id: number;
  theme: number;
  players: number;
  question: string | null;
  in_progress: boolean;
  next_game: Date;
}
